import { Router } from 'express';
import { generateReport, viewReport, exportReportPdf } from '../controllers/report.controller';

const router = Router();

router.post('/generate', generateReport as any);
router.get('/view/:reportId', viewReport as any);
router.get('/export/:reportId/pdf', exportReportPdf as any);

export default router;
