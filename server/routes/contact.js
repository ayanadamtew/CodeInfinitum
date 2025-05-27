import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer'; // For email notifications
import ContactSubmission from '../models/ContactSubmission.js'; // Your Mongoose model
import { auth as authMiddleware, adminAuth as adminAuthMiddleware } from '../middleware/auth.js'; // Your authentication middlewares

// --- Nodemailer Transporter Configuration ---
let transporter;

// Ensure SMTP_HOST, SMTP_USER, etc., are set in your .env file
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"), // Default to 587 if not set
        secure: process.env.SMTP_SECURE === 'true', // `secure: true` for port 465, `false` for others
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        // Optional: For local development with self-signed certificates
        // tls: {
        //   rejectUnauthorized: false
        // }
    });

    if (process.env.NODE_ENV !== 'test') { // Avoid in test environments
        transporter.verify(function (error, success) {
            if (error) {
                console.error("Nodemailer transporter verification error:", error.message);
            } else {
                console.log("Nodemailer transporter is configured and ready to send emails.");
            }
        });
    }
} else {
    console.warn(
        "SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL) are not fully set. Email notifications for contact form will be disabled."
    );
    transporter = null; // Explicitly set to null if not configured
}
// --- End Nodemailer Configuration ---


// POST /api/contact/submit
router.post(
    "/submit",
    [
      // Validation rules
      body("name").trim().notEmpty().withMessage("Name is required.").isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters.").escape(),
      body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Please provide a valid email address.").normalizeEmail(),
      body("subject").trim().notEmpty().withMessage("Subject is required.").isLength({ min: 3, max: 150 }).withMessage("Subject must be between 3 and 150 characters.").escape(),
      body("message").trim().notEmpty().withMessage("Message is required.").isLength({ min: 10, max: 5000 }).withMessage("Message must be between 10 and 5000 characters.").escape(),
    ],
    async (req, res) => {
      const expressValidatorErrors = validationResult(req);
      if (!expressValidatorErrors.isEmpty()) {
        return res.status(400).json({ errors: expressValidatorErrors.array() });
      }

      const { name, email, subject, message } = req.body;

      try {
        // 1. Create and Save the submission to the database
        const newSubmission = new ContactSubmission({
          name,
          email,
          subject,
          message,
          // status defaults to 'new' as per model
        });
        await newSubmission.save(); // This will also run Mongoose schema validations

        console.log(`Contact submission from ${email} saved to database with ID: ${newSubmission._id}`);

        // 2. Send an email notification if transporter is configured
        if (transporter) {
          const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`, // Use your authenticated email as 'from'
            replyTo: email, // So admin can reply directly to the user's email
            to: process.env.ADMIN_EMAIL, // Your admin email address
            subject: `New Contact Form (#${newSubmission._id}): ${subject}`,
            html: `
              <p>You have received a new contact form submission (ID: ${newSubmission._id}):</p>
              <hr>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="padding: 10px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <hr>
              <p><em>Received at: ${newSubmission.submittedAt.toUTCString()}</em></p>
            `,
          };
        
          await transporter.sendMail(mailOptions);
          console.log(`Contact form notification email sent to admin for submission ID: ${newSubmission._id}`);
        } else if (process.env.NODE_ENV !== 'test') {
          console.warn(`Nodemailer transporter not configured. Email notification skipped for submission ID: ${newSubmission._id}`);
        }

        res.status(201).json({
            message: "Your message has been received successfully! We will get back to you shortly.",
            submissionId: newSubmission._id
          });

      } catch (error) {
        console.error("Error processing contact form:", error.message);
        if (error.name === 'ValidationError') {
          const mongooseErrors = {};
          for (let field in error.errors) {
            mongooseErrors[field] = error.errors[field].message;
          }
          return res.status(400).json({
            message: 'Validation failed. Please check your input.',
            errors: mongooseErrors
          });
        }
        if (error.code === 'EENVELOPE' || error.command === 'CONN' && transporter) {
          return res.status(503).json({ message: 'There was an issue with our email service. Your message was saved but not emailed. Please contact us directly if urgent.' });
        }
        res.status(500).json({
            message: "An error occurred while processing your request. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
      }
    }
  );



// GET /api/contact/submissions (Admin only - List submissions with pagination and filter)
router.get(
    '/submissions',
    authMiddleware,
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const { status, page = 1, limit = 10, search } = req.query;

            const query = {};
            if (status && ['new', 'resolved'].includes(status)) {
                query.status = status;
            }
            if (search) {
                const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
                query.$or = [
                    { name: searchRegex },
                    { email: searchRegex },
                    { subject: searchRegex }
                ];
            }


            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            if (isNaN(pageNum) || pageNum < 1) return res.status(400).json({ message: "Invalid page number." });
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) return res.status(400).json({ message: "Invalid limit value." });

            const skip = (pageNum - 1) * limitNum;

            const submissions = await ContactSubmission.find(query)
                .sort({ submittedAt: -1 }) 
                .skip(skip)
                .limit(limitNum)
                .select('-message -notes') 
                .lean();

            const totalSubmissions = await ContactSubmission.countDocuments(query);
            const totalPages = Math.ceil(totalSubmissions / limitNum);

            // Format for frontend consistency (e.g., _id to id, submittedAt to createdAt)
            const formattedSubmissions = submissions.map(sub => ({
                id: sub._id.toString(),
                name: sub.name,
                email: sub.email,
                subject: sub.subject,
                status: sub.status,
                createdAt: sub.submittedAt, 
            }));

            res.json({
                requests: formattedSubmissions, 
                currentPage: pageNum,
                totalPages,
                totalRequests: totalSubmissions
            });
        } catch (error) {
            console.error('Error fetching contact submissions for admin:', error);
            res.status(500).json({ message: 'Failed to fetch contact submissions.' });
        }
    }
);

// GET /api/contact/submissions/:submissionId (Admin only - Get full details of one request)
router.get(
    '/submissions/:submissionId',
    authMiddleware,
    adminAuthMiddleware,
    async (req, res) => {
        try {
            const submission = await ContactSubmission.findById(req.params.submissionId);
            if (!submission) {
                return res.status(404).json({ message: 'Contact submission not found.' });
            }
            // Format for frontend if necessary (e.g., _id to id)
            const formattedSubmission = {
                id: submission._id.toString(),
                name: submission.name,
                email: submission.email,
                subject: submission.subject,
                message: submission.message,
                status: submission.status,
                isRead: submission.isRead,
                respondedAt: submission.respondedAt,
                notes: submission.notes,
                createdAt: submission.submittedAt, 
            };
            res.json(formattedSubmission);
        } catch (error) {
            console.error(`Error fetching contact submission ${req.params.submissionId}:`, error);
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ message: 'Invalid submission ID format.' });
            }
            res.status(500).json({ message: 'Failed to fetch contact submission details.' });
        }
    }
);


// PUT /api/contact/submissions/:submissionId (Admin only - Update status and notes)
router.put(
    '/submissions/:submissionId',
    authMiddleware,
    adminAuthMiddleware,
    [ // Optional: Add some validation for the update payload
        body('status').optional().isIn(['new', 'resolved']).withMessage('Invalid status value.'),
        body('notes').optional().isString().trim().escape(),
        body('isRead').optional().isBoolean(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { submissionId } = req.params;
            const { status, notes, isRead } = req.body;

            const updateData = {};
            if (status) updateData.status = status;
            if (notes !== undefined) updateData.notes = notes; // Allow clearing notes with an empty string
            if (isRead !== undefined) updateData.isRead = isRead;


            // If marking as resolved, and it wasn't already, set respondedAt and isRead
            if (status === 'resolved') {
                const currentSubmission = await ContactSubmission.findById(submissionId).select('status respondedAt isRead');
                if (currentSubmission) {
                    if (currentSubmission.status !== 'resolved' && !currentSubmission.respondedAt) {
                        updateData.respondedAt = new Date();
                    }
                    if (!currentSubmission.isRead) { // Also mark as read if resolving
                        updateData.isRead = true;
                    }
                }
            } else if (status === 'new' && updateData.isRead === undefined) {
                 // If marking back to new, and isRead is not explicitly set, assume it's not read.
                 // Or, you might want to keep isRead true if it was already read. This depends on your logic.
                 // updateData.isRead = false; // Example: Reset isRead if marked as new
            }


            const updatedSubmission = await ContactSubmission.findByIdAndUpdate(
                submissionId,
                { $set: updateData },
                { new: true, runValidators: true } // Return the updated document and run schema validators
            );

            if (!updatedSubmission) {
                return res.status(404).json({ message: 'Contact submission not found.' });
            }

            // Format for frontend consistency
            const formattedResponse = {
                id: updatedSubmission._id.toString(),
                name: updatedSubmission.name,
                email: updatedSubmission.email,
                subject: updatedSubmission.subject,
                message: updatedSubmission.message,
                status: updatedSubmission.status,
                isRead: updatedSubmission.isRead,
                respondedAt: updatedSubmission.respondedAt,
                notes: updatedSubmission.notes,
                createdAt: updatedSubmission.submittedAt,
            };

            res.json(formattedResponse);
        } catch (error) {
            console.error(`Error updating contact submission ${req.params.submissionId}:`, error);
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ message: 'Invalid submission ID format.' });
            }
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation error during update.', errors: error.errors });
            }
            res.status(500).json({ message: 'Failed to update contact submission.' });
        }
    }
);

export default router;


