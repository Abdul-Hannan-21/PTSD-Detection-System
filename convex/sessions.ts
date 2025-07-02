import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createSession = mutation({
  args: {
    participantName: v.string(),
    participantAge: v.optional(v.number()),
    sessionType: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    return await ctx.db.insert("sessions", {
      userId,
      participantName: args.participantName,
      participantAge: args.participantAge,
      sessionType: args.sessionType,
      status: "active",
      startTime: Date.now()
    });
  },
});

export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id("sessions"),
    status: v.string(),
    calibrationData: v.optional(v.object({
      baselinePupilSize: v.number(),
      gazeAccuracy: v.number(),
      calibrationPoints: v.array(v.object({
        x: v.number(),
        y: v.number(),
        accuracy: v.number()
      }))
    }))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    const updateData: any = {
      status: args.status
    };

    if (args.status === "completed") {
      updateData.endTime = Date.now();
    }

    if (args.calibrationData) {
      updateData.calibrationData = args.calibrationData;
    }

    await ctx.db.patch(args.sessionId, updateData);
  },
});

export const getUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    return session;
  },
});

export const recordEyeTrackingData = mutation({
  args: {
    sessionId: v.id("sessions"),
    timestamp: v.number(),
    stimulusId: v.optional(v.string()),
    gazeX: v.number(),
    gazeY: v.number(),
    pupilDiameter: v.number(),
    blinkDetected: v.boolean(),
    fixationDuration: v.optional(v.number()),
    saccadeVelocity: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    await ctx.db.insert("eyeTrackingData", {
      sessionId: args.sessionId,
      timestamp: args.timestamp,
      stimulusId: args.stimulusId,
      gazeX: args.gazeX,
      gazeY: args.gazeY,
      pupilDiameter: args.pupilDiameter,
      blinkDetected: args.blinkDetected,
      fixationDuration: args.fixationDuration,
      saccadeVelocity: args.saccadeVelocity
    });
  },
});
