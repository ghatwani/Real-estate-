import express from "express";
import { test, updateUser ,deleteUser,getUserListing} from "../controllers/userControllers.js";
import { verifyToken } from "../utils/verifyUser.js";


const router= express.Router()

router.get('/test', test)
router.get('/listings/:id', verifyToken, getUserListing)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

export default router;