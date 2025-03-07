from typing import Dict, Any
from app.core.realtime import realtime
from app.models.ai import Embedding, MatchResult, BiasReport
from app.core.logging import get_logger

logger = get_logger(__name__)

async def handle_new_job(data: Dict[str, Any]):
    """Handle new job creation events."""
    try:
        # Generate job embedding
        job_id = data["job_id"]
        job_description = data["description"]
        
        # Call AI service for embedding generation
        embedding = await ai_service.generate_embedding(
            text=job_description,
            entity_type="job",
            entity_id=job_id
        )
        
        # Store embedding
        await Embedding.create(
            entity_type="job",
            entity_id=job_id,
            vector=embedding.vector,
            model_version=embedding.model_version,
            dimension=embedding.dimension
        )
        
        # Check for bias
        bias_report = await ai_service.detect_bias(
            text=job_description,
            entity_type="job",
            entity_id=job_id
        )
        
        # Store bias report
        await BiasReport.create(
            entity_type="job",
            entity_id=job_id,
            bias_score=bias_report.score,
            confidence=bias_report.confidence,
            categories=bias_report.categories,
            findings=bias_report.findings,
            recommendations=bias_report.recommendations,
            requires_review=bias_report.requires_review
        )
        
        # Find matching freelancers
        matches = await ai_service.find_matches(job_id)
        
        # Store match results
        for match in matches:
            await MatchResult.create(
                job_id=job_id,
                freelancer_id=match.freelancer_id,
                score=match.score,
                confidence=match.confidence,
                ranking=match.ranking,
                skill_match=match.components.get("skills"),
                experience_match=match.components.get("experience"),
                success_rate_match=match.components.get("success_rate"),
                region_match=match.components.get("region"),
                match_factors=match.factors
            )
            
            # Notify matched freelancers
            await realtime.broadcast_to_user(
                user_id=match.freelancer_id,
                message={
                    "type": "new_job_match",
                    "data": {
                        "job_id": job_id,
                        "match_score": match.score,
                        "match_factors": match.factors
                    }
                }
            )
            
    except Exception as e:
        logger.error("Error processing new job", error=str(e))

async def handle_profile_update(data: Dict[str, Any]):
    """Handle freelancer profile updates."""
    try:
        user_id = data["user_id"]
        profile_data = data["profile"]
        
        # Generate new profile embedding
        embedding = await ai_service.generate_embedding(
            text=profile_data["description"],
            entity_type="user",
            entity_id=user_id
        )
        
        # Update or create embedding
        await Embedding.update_or_create(
            entity_type="user",
            entity_id=user_id,
            vector=embedding.vector,
            model_version=embedding.model_version,
            dimension=embedding.dimension
        )
        
        # Check for bias in profile
        bias_report = await ai_service.detect_bias(
            text=profile_data["description"],
            entity_type="user",
            entity_id=user_id
        )
        
        # Store bias report
        await BiasReport.create(
            entity_type="user",
            entity_id=user_id,
            bias_score=bias_report.score,
            confidence=bias_report.confidence,
            categories=bias_report.categories,
            findings=bias_report.findings,
            recommendations=bias_report.recommendations,
            requires_review=bias_report.requires_review
        )
        
        # Find new matching jobs
        matches = await ai_service.find_matches_for_freelancer(user_id)
        
        # Store and notify about new matches
        for match in matches:
            await MatchResult.create(
                job_id=match.job_id,
                freelancer_id=user_id,
                score=match.score,
                confidence=match.confidence,
                ranking=match.ranking,
                skill_match=match.components.get("skills"),
                experience_match=match.components.get("experience"),
                success_rate_match=match.components.get("success_rate"),
                region_match=match.components.get("region"),
                match_factors=match.factors
            )
            
            # Notify freelancer about new matches
            await realtime.broadcast_to_user(
                user_id=user_id,
                message={
                    "type": "new_job_match",
                    "data": {
                        "job_id": match.job_id,
                        "match_score": match.score,
                        "match_factors": match.factors
                    }
                }
            )
            
    except Exception as e:
        logger.error("Error processing profile update", error=str(e))

async def handle_review_created(data: Dict[str, Any]):
    """Handle new review creation."""
    try:
        review_id = data["review_id"]
        review_text = data["text"]
        
        # Check for bias in review
        bias_report = await ai_service.detect_bias(
            text=review_text,
            entity_type="review",
            entity_id=review_id
        )
        
        # Store bias report
        await BiasReport.create(
            entity_type="review",
            entity_id=review_id,
            bias_score=bias_report.score,
            confidence=bias_report.confidence,
            categories=bias_report.categories,
            findings=bias_report.findings,
            recommendations=bias_report.recommendations,
            requires_review=bias_report.requires_review
        )
        
        # If bias detected, notify moderators
        if bias_report.requires_review:
            await realtime.publish_event(
                "review_needs_moderation",
                {
                    "review_id": review_id,
                    "bias_report": bias_report.dict()
                }
            )
            
    except Exception as e:
        logger.error("Error processing review", error=str(e))

def register_handlers():
    """Register all AI event handlers."""
    realtime.register_handler("new_job", handle_new_job)
    realtime.register_handler("profile_updated", handle_profile_update)
    realtime.register_handler("review_created", handle_review_created) 