import {prisma} from '../utils/index.js';

export default async function (req,res,next){
  try{
    const { isAdmin } = req.user;
    if(!isAdmin){
      return res.status(403).json({message:'접근권한이 없습니다.'});
    }
    next();
  }catch(error){
    return res.status(400).json({message:error.message});
  }
}