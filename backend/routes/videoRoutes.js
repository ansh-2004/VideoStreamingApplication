import express from 'express'
import { videoUpload,getVideos, getVideoByID,videoStreaming } from '../controllers/VideoController.js'

import { protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
import {allowRoles} from '../middleware/roleMiddleware.js'
const router = express.Router()

router.post('/upload',protect,allowRoles("editor","admin"), upload.single("video"),videoUpload)

router.get('/all',protect,getVideos)
router.get('/stream/:id',videoStreaming)
router.get('/:id',protect,getVideoByID)

export default router