import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActiveStimuli = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("stimuli").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    return await query.collect();
  },
});

export const createStimulus = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    category: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    duration: v.number()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    return await ctx.db.insert("stimuli", {
      name: args.name,
      type: args.type,
      category: args.category,
      content: args.content,
      imageUrl: args.imageUrl,
      duration: args.duration,
      isActive: true
    });
  },
});

// Enhanced default stimuli with more comprehensive PTSD-related content
export const initializeDefaultStimuli = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const existingStimuli = await ctx.db.query("stimuli").collect();
    if (existingStimuli.length > 0) {
      return; // Already initialized
    }

    const defaultStimuli = [
      // Neutral words - baseline measurements
      { name: "Chair", type: "word", category: "neutral", content: "CHAIR", duration: 3000 },
      { name: "Table", type: "word", category: "neutral", content: "TABLE", duration: 3000 },
      { name: "Book", type: "word", category: "neutral", content: "BOOK", duration: 3000 },
      { name: "Window", type: "word", category: "neutral", content: "WINDOW", duration: 3000 },
      { name: "Garden", type: "word", category: "neutral", content: "GARDEN", duration: 3000 },
      { name: "Coffee", type: "word", category: "neutral", content: "COFFEE", duration: 3000 },
      
      // Emotional words - general stress response
      { name: "Danger", type: "word", category: "emotional", content: "DANGER", duration: 3500 },
      { name: "Fear", type: "word", category: "emotional", content: "FEAR", duration: 3500 },
      { name: "Threat", type: "word", category: "emotional", content: "THREAT", duration: 3500 },
      { name: "Panic", type: "word", category: "emotional", content: "PANIC", duration: 3500 },
      { name: "Terror", type: "word", category: "emotional", content: "TERROR", duration: 3500 },
      { name: "Anxiety", type: "word", category: "emotional", content: "ANXIETY", duration: 3500 },
      
      // Trauma-related words - specific PTSD triggers
      { name: "Combat", type: "word", category: "trauma-related", content: "COMBAT", duration: 4000 },
      { name: "Explosion", type: "word", category: "trauma-related", content: "EXPLOSION", duration: 4000 },
      { name: "Attack", type: "word", category: "trauma-related", content: "ATTACK", duration: 4000 },
      { name: "Violence", type: "word", category: "trauma-related", content: "VIOLENCE", duration: 4000 },
      { name: "Flashback", type: "word", category: "trauma-related", content: "FLASHBACK", duration: 4000 },
      { name: "Nightmare", type: "word", category: "trauma-related", content: "NIGHTMARE", duration: 4000 },
      { name: "Survivor", type: "word", category: "trauma-related", content: "SURVIVOR", duration: 4000 },
      { name: "Helpless", type: "word", category: "trauma-related", content: "HELPLESS", duration: 4000 },
      
      // Neutral faces - baseline facial processing
      { name: "Neutral Face 1", type: "face", category: "neutral", content: "Calm, relaxed expression with neutral gaze", duration: 5000 },
      { name: "Neutral Face 2", type: "face", category: "neutral", content: "Peaceful, composed expression", duration: 5000 },
      { name: "Neutral Face 3", type: "face", category: "neutral", content: "Serene, balanced facial expression", duration: 5000 },
      
      // Emotional faces - stress response to facial expressions
      { name: "Angry Face", type: "face", category: "emotional", content: "Intense angry expression with furrowed brow", duration: 5500 },
      { name: "Fearful Face", type: "face", category: "emotional", content: "Frightened expression with wide eyes", duration: 5500 },
      { name: "Distressed Face", type: "face", category: "emotional", content: "Anguished, distressed expression", duration: 5500 },
      { name: "Threatening Face", type: "face", category: "emotional", content: "Menacing, intimidating expression", duration: 5500 },
      
      // Trauma-related faces - specific PTSD facial triggers
      { name: "Combat Veteran", type: "face", category: "trauma-related", content: "Stern military expression with thousand-yard stare", duration: 6000 },
      { name: "Victim Expression", type: "face", category: "trauma-related", content: "Traumatized, haunted expression", duration: 6000 },
      { name: "Authority Figure", type: "face", category: "trauma-related", content: "Authoritative, commanding expression", duration: 6000 },
      
      // Neutral images - environmental baselines
      { name: "Peaceful Landscape", type: "image", category: "neutral", content: "Serene mountain landscape with clear sky", duration: 4000 },
      { name: "Quiet Library", type: "image", category: "neutral", content: "Calm library interior with books", duration: 4000 },
      { name: "Garden Scene", type: "image", category: "neutral", content: "Tranquil garden with flowers and trees", duration: 4000 },
      
      // Emotional images - general stress triggers
      { name: "Storm Clouds", type: "image", category: "emotional", content: "Dark, threatening storm clouds", duration: 4500 },
      { name: "Emergency Scene", type: "image", category: "emotional", content: "Ambulance and emergency responders", duration: 4500 },
      { name: "Accident Scene", type: "image", category: "emotional", content: "Vehicle accident with damage", duration: 4500 },
      
      // Trauma-related images - specific PTSD environmental triggers
      { name: "Military Vehicle", type: "image", category: "trauma-related", content: "Military convoy in desert terrain", duration: 5000 },
      { name: "Hospital Room", type: "image", category: "trauma-related", content: "Intensive care hospital room", duration: 5000 },
      { name: "Crowd Scene", type: "image", category: "trauma-related", content: "Dense crowd of people in public space", duration: 5000 },
      { name: "Dark Alley", type: "image", category: "trauma-related", content: "Dimly lit urban alleyway", duration: 5000 }
    ];

    for (const stimulus of defaultStimuli) {
      await ctx.db.insert("stimuli", {
        ...stimulus,
        isActive: true
      });
    }
  },
});
