from beanie import PydanticObjectId
from backend.models.jovem_model import Jovem, HardSkill, SoftSkill
from pydantic import BaseModel
from typing import List
from datetime import datetime

class SkillsFromManguelito(BaseModel):
    hard_skills: List[str] = []
    soft_skills: List[str] = []

async def injetar_skills(jovem_id: str, skills: SkillsFromManguelito) -> dict:
    jovem = await Jovem.get(PydanticObjectId(jovem_id))
    if not jovem:
        raise ValueError("Jovem não encontrado")

    novas_hard = [HardSkill(nome=nome).model_dump() for nome in skills.hard_skills]
    novas_soft = [SoftSkill(nome=nome).model_dump() for nome in skills.soft_skills]

    await jovem.update({
        "$addToSet": {
            "hard_skills": {"$each": novas_hard},
            "soft_skills": {"$each": novas_soft}
        },
        "$set": {
            "atualizado_em": datetime.utcnow()
        }
    })

    return {
        "message": "Skills atualizadas com sucesso",
        "hard_skills_adicionadas": skills.hard_skills,
        "soft_skills_adicionadas": skills.soft_skills
    }