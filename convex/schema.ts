import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  sessions: defineTable({
    userId: v.id("users"),
    participantName: v.string(),
    participantAge: v.optional(v.number()),
    sessionType: v.string(), // "calibration", "screening", "complete"
    status: v.string(), // "active", "completed", "cancelled"
    startTime: v.number(),
    endTime: v.optional(v.number()),
    calibrationData: v.optional(v.object({
      baselinePupilSize: v.number(),
      gazeAccuracy: v.number(),
      calibrationPoints: v.array(v.object({
        x: v.number(),
        y: v.number(),
        accuracy: v.number()
      }))
    })),
    stimuliPresented: v.optional(v.array(v.object({
      stimulusId: v.string(),
      type: v.string(), // "image", "word", "face"
      category: v.string(), // "neutral", "emotional", "trauma-related"
      presentationTime: v.number(),
      duration: v.number()
    }))),
    analysisResults: v.optional(v.object({
      ptsdMarkers: v.array(v.object({
        marker: v.string(),
        severity: v.number(),
        confidence: v.number(),
        description: v.string()
      })),
      overallScore: v.number(),
      recommendations: v.array(v.string())
    }))
  }).index("by_user", ["userId"]).index("by_status", ["status"]),

  eyeTrackingData: defineTable({
    sessionId: v.id("sessions"),
    timestamp: v.number(),
    stimulusId: v.optional(v.string()),
    gazeX: v.number(),
    gazeY: v.number(),
    pupilDiameter: v.number(),
    blinkDetected: v.boolean(),
    fixationDuration: v.optional(v.number()),
    saccadeVelocity: v.optional(v.number())
  }).index("by_session", ["sessionId"]).index("by_timestamp", ["timestamp"]),

  stimuli: defineTable({
    name: v.string(),
    type: v.string(), // "image", "word", "face"
    category: v.string(), // "neutral", "emotional", "trauma-related"
    content: v.string(), // text content or image description
    imageUrl: v.optional(v.string()),
    duration: v.number(), // presentation duration in ms
    isActive: v.boolean()
  }).index("by_category", ["category"]).index("by_type", ["type"]),

  reports: defineTable({
    sessionId: v.id("sessions"),
    generatedBy: v.id("users"),
    reportData: v.object({
      participantInfo: v.object({
        name: v.string(),
        age: v.optional(v.number()),
        sessionDate: v.string()
      }),
      keyFindings: v.array(v.string()),
      ptsdIndicators: v.array(v.object({
        indicator: v.string(),
        severity: v.string(),
        description: v.string()
      })),
      visualizations: v.array(v.object({
        type: v.string(),
        data: v.string()
      })),
      clinicalSummary: v.string(),
      recommendations: v.array(v.string())
    }),
    generatedAt: v.number()
  }).index("by_session", ["sessionId"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
