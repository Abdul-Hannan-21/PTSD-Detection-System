import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const analyzeSession = mutation({
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

    // Get all eye tracking data for this session
    const eyeData = await ctx.db
      .query("eyeTrackingData")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    if (eyeData.length === 0) {
      throw new Error("No eye tracking data found for analysis");
    }

    // Enhanced PTSD marker analysis
    const ptsdMarkers = [];
    let overallScore = 0;

    // 1. Advanced Pupil Dilation Analysis
    const pupilSizes = eyeData.map(d => d.pupilDiameter);
    const avgPupilSize = pupilSizes.reduce((a, b) => a + b, 0) / pupilSizes.length;
    const pupilVariability = Math.sqrt(pupilSizes.reduce((sum, size) => sum + Math.pow(size - avgPupilSize, 2), 0) / pupilSizes.length);
    
    // Separate analysis by stimulus category
    const neutralData = eyeData.filter(d => d.stimulusId && d.stimulusId.includes("neutral"));
    const emotionalData = eyeData.filter(d => d.stimulusId && d.stimulusId.includes("emotional"));
    const traumaData = eyeData.filter(d => d.stimulusId && d.stimulusId.includes("trauma"));

    // Enhanced pupil response analysis
    if (pupilVariability > 0.4) {
      const severity = Math.min(pupilVariability * 1.5, 1);
      ptsdMarkers.push({
        marker: "Pupil Dilation Dysregulation",
        severity,
        confidence: 0.85,
        description: `Significant pupil size variability (${pupilVariability.toFixed(2)}mm) indicates autonomic nervous system dysregulation, commonly associated with hyperarousal in PTSD`
      });
      overallScore += severity * 0.25;
    }

    // 2. Enhanced Gaze Avoidance Analysis
    if (emotionalData.length > 0 && traumaData.length > 0) {
      const emotionalFixations = emotionalData.filter(d => d.fixationDuration).map(d => d.fixationDuration!);
      const traumaFixations = traumaData.filter(d => d.fixationDuration).map(d => d.fixationDuration!);
      const neutralFixations = neutralData.filter(d => d.fixationDuration).map(d => d.fixationDuration!);
      
      if (emotionalFixations.length > 0 && neutralFixations.length > 0) {
        const avgEmotionalFixation = emotionalFixations.reduce((a, b) => a + b, 0) / emotionalFixations.length;
        const avgNeutralFixation = neutralFixations.reduce((a, b) => a + b, 0) / neutralFixations.length;
        const avoidanceRatio = avgEmotionalFixation / avgNeutralFixation;
        
        if (avoidanceRatio < 0.7) { // Significantly shorter fixations on emotional content
          const severity = (0.7 - avoidanceRatio) / 0.7;
          ptsdMarkers.push({
            marker: "Emotional Stimulus Avoidance",
            severity,
            confidence: 0.8,
            description: `Reduced fixation duration on emotional stimuli (${(avoidanceRatio * 100).toFixed(1)}% of neutral baseline) suggests avoidance behavior characteristic of PTSD`
          });
          overallScore += severity * 0.3;
        }
      }

      // Trauma-specific avoidance
      if (traumaFixations.length > 0 && neutralFixations.length > 0) {
        const avgTraumaFixation = traumaFixations.reduce((a, b) => a + b, 0) / traumaFixations.length;
        const avgNeutralFixation = neutralFixations.reduce((a, b) => a + b, 0) / neutralFixations.length;
        const traumaAvoidanceRatio = avgTraumaFixation / avgNeutralFixation;
        
        if (traumaAvoidanceRatio < 0.6) {
          const severity = (0.6 - traumaAvoidanceRatio) / 0.6;
          ptsdMarkers.push({
            marker: "Trauma-Related Avoidance",
            severity,
            confidence: 0.9,
            description: `Severe avoidance of trauma-related stimuli (${(traumaAvoidanceRatio * 100).toFixed(1)}% of neutral baseline) indicates strong trauma-specific avoidance patterns`
          });
          overallScore += severity * 0.35;
        }
      }
    }

    // 3. Enhanced Hypervigilance Detection
    const saccadeVelocities = eyeData.filter(d => d.saccadeVelocity).map(d => d.saccadeVelocity!);
    if (saccadeVelocities.length > 0) {
      const avgSaccadeVelocity = saccadeVelocities.reduce((a, b) => a + b, 0) / saccadeVelocities.length;
      const saccadeVariability = Math.sqrt(saccadeVelocities.reduce((sum, vel) => sum + Math.pow(vel - avgSaccadeVelocity, 2), 0) / saccadeVelocities.length);
      
      if (avgSaccadeVelocity > 280) {
        const severity = Math.min((avgSaccadeVelocity - 280) / 150, 1);
        ptsdMarkers.push({
          marker: "Hypervigilant Scanning Pattern",
          severity,
          confidence: 0.75,
          description: `Elevated saccadic velocity (${avgSaccadeVelocity.toFixed(1)}°/s) indicates hypervigilant environmental scanning behavior typical of PTSD hyperarousal`
        });
        overallScore += severity * 0.25;
      }

      // Scan pattern irregularity
      if (saccadeVariability > 80) {
        const severity = Math.min(saccadeVariability / 120, 1);
        ptsdMarkers.push({
          marker: "Erratic Scan Patterns",
          severity,
          confidence: 0.7,
          description: `High variability in eye movement patterns suggests disrupted attention regulation and hypervigilant threat scanning`
        });
        overallScore += severity * 0.2;
      }
    }

    // 4. Enhanced Stress Response Analysis
    const blinkCount = eyeData.filter(d => d.blinkDetected).length;
    const sessionDuration = (session.endTime || Date.now()) - session.startTime;
    const blinkRate = (blinkCount / sessionDuration) * 60000; // blinks per minute
    
    if (blinkRate > 18) {
      const severity = Math.min((blinkRate - 18) / 12, 1);
      ptsdMarkers.push({
        marker: "Elevated Stress Response",
        severity,
        confidence: 0.65,
        description: `Increased blink rate (${blinkRate.toFixed(1)} blinks/min) may indicate elevated stress and anxiety levels during assessment`
      });
      overallScore += severity * 0.15;
    }

    // 5. Attention Regulation Analysis
    const gazeData = eyeData.filter(d => d.stimulusId);
    if (gazeData.length > 0) {
      // Calculate gaze stability
      const gazeXVariability = Math.sqrt(gazeData.reduce((sum, d) => sum + Math.pow(d.gazeX - 50, 2), 0) / gazeData.length);
      const gazeYVariability = Math.sqrt(gazeData.reduce((sum, d) => sum + Math.pow(d.gazeY - 50, 2), 0) / gazeData.length);
      const gazeInstability = (gazeXVariability + gazeYVariability) / 2;
      
      if (gazeInstability > 15) {
        const severity = Math.min(gazeInstability / 25, 1);
        ptsdMarkers.push({
          marker: "Attention Dysregulation",
          severity,
          confidence: 0.7,
          description: `Unstable gaze patterns indicate difficulty maintaining focused attention, consistent with PTSD-related concentration problems`
        });
        overallScore += severity * 0.2;
      }
    }

    // Generate enhanced recommendations based on findings
    const recommendations = [];
    const finalScore = Math.min(overallScore, 1);
    
    if (finalScore >= 0.7) {
      recommendations.push("URGENT: Comprehensive PTSD assessment by qualified mental health professional recommended within 48 hours");
      recommendations.push("Consider immediate safety assessment and crisis intervention if needed");
      recommendations.push("Implement trauma-informed care protocols");
      recommendations.push("Monitor for additional trauma-related symptoms and comorbidities");
    } else if (finalScore >= 0.4) {
      recommendations.push("Follow-up PTSD screening recommended within 2-4 weeks");
      recommendations.push("Consider stress management and coping skills interventions");
      recommendations.push("Monitor sleep patterns and anxiety levels");
      recommendations.push("Provide psychoeducation about trauma responses");
    } else {
      recommendations.push("No significant PTSD markers detected in current eye tracking analysis");
      recommendations.push("Continue routine mental health monitoring");
      recommendations.push("Maintain healthy stress management practices");
      recommendations.push("Consider annual screening if risk factors present");
    }

    // Update session with analysis results
    await ctx.db.patch(args.sessionId, {
      analysisResults: {
        ptsdMarkers,
        overallScore: finalScore,
        recommendations
      }
    });

    return {
      ptsdMarkers,
      overallScore: finalScore,
      recommendations
    };
  },
});

export const getSessionAnalysis = query({
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

    return session.analysisResults;
  },
});
