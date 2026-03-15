import { Router } from "express";
import { insertMembers, findAllMember } from "../controllers/members-collection.js";
const memberRoutes = Router();
memberRoutes.post('/members', insertMembers);
memberRoutes.get('/members', findAllMember);
export {memberRoutes};