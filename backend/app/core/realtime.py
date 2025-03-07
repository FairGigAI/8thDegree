from typing import Any, Dict, List, Optional, Callable
import json
import asyncio
from datetime import datetime
from redis import asyncio as aioredis
from fastapi import WebSocket
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class RealtimeManager:
    """Manages real-time events and WebSocket connections."""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.event_handlers: Dict[str, List[Callable]] = {}
        
    async def connect(self):
        """Initialize Redis connection."""
        if not self.redis:
            self.redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            
    async def disconnect(self):
        """Close Redis connection."""
        if self.redis:
            await self.redis.close()
            self.redis = None
            
    async def register_websocket(self, websocket: WebSocket, user_id: str):
        """Register a new WebSocket connection."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        
    async def unregister_websocket(self, websocket: WebSocket, user_id: str):
        """Unregister a WebSocket connection."""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                
    async def broadcast_to_user(self, user_id: str, message: Dict[str, Any]):
        """Send a message to all connections of a specific user."""
        if user_id in self.active_connections:
            dead_connections = []
            for websocket in self.active_connections[user_id]:
                try:
                    await websocket.send_json(message)
                except:
                    dead_connections.append(websocket)
                    
            # Clean up dead connections
            for dead in dead_connections:
                await self.unregister_websocket(dead, user_id)
                
    async def publish_event(self, event_type: str, data: Dict[str, Any]):
        """Publish an event to Redis."""
        if not self.redis:
            await self.connect()
            
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.redis.publish("events", json.dumps(event))
        
    async def subscribe_to_events(self):
        """Subscribe to Redis events and process them."""
        if not self.redis:
            await self.connect()
            
        pubsub = self.redis.pubsub()
        await pubsub.subscribe("events")
        
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message:
                    event = json.loads(message["data"])
                    await self.process_event(event)
        finally:
            await pubsub.unsubscribe("events")
            
    async def process_event(self, event: Dict[str, Any]):
        """Process an incoming event."""
        event_type = event["type"]
        
        # Execute registered handlers for this event type
        if event_type in self.event_handlers:
            for handler in self.event_handlers[event_type]:
                try:
                    await handler(event["data"])
                except Exception as e:
                    logger.error(f"Error processing event {event_type}", error=str(e))
                    
    def register_handler(self, event_type: str, handler: Callable):
        """Register a handler for a specific event type."""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)
        
    async def start(self):
        """Start the real-time manager."""
        await self.connect()
        asyncio.create_task(self.subscribe_to_events())
        
    async def stop(self):
        """Stop the real-time manager."""
        await self.disconnect()

# Global instance
realtime = RealtimeManager() 