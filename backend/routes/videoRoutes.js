import express from 'express'
import { videoUpload,getVideos, getVideoByID } from '../controllers/VideoController.js'

import { protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/upload',protect,upload.single("video"),videoUpload)

router.get('/',protect,getVideos)
router.get('/:id',protect,getVideoByID)
export default router