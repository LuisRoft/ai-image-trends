import { type ImagePrompt } from "./types";

export const aiImagePrompts: ImagePrompt[] = [
  {
    id: "illustration-to-figure",
    title: "Illustration to Figure",
    description:
      "Transform a photo into a character figure with box packaging.",
    category: "3D & Models",
    prompt:
      "turn this photo into a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "3D Figure Visualization",
    difficulty: "easy",
    tags: ["3d", "figure", "toy", "blender", "packaging"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1958539464994959715",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case1/output0.jpg",
  },
  {
    id: "ground-view-from-map",
    title: "Generate Ground View from Map Arrow",
    description:
      "Generate a real-world ground view from a Google Maps image with a red arrow.",
    category: "Image Generation",
    prompt:
      "draw what the red arrow sees / draw the real world view from the red circle in the direction of the arrow.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Google Maps image with a red arrow",
        required: true,
      },
    ],
    outputType: "Realistic Scene",
    difficulty: "easy",
    tags: ["map", "google maps", "street view", "image generation"],
    author: "@tokumin",
    sourceUrl: "https://x.com/tokumin/status/1960583251460022626",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case2/output.jpg",
  },
  {
    id: "real-world-ar",
    title: "Real World AR Information",
    description:
      "Generate a location-based AR experience, highlighting points of interest with annotations.",
    category: "AR & VR",
    prompt:
      "you are a location-based AR experience generator. highlight [point of interest] in this image and annotate relevant information about it.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image for AR",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Point of interest to annotate",
        required: true,
        placeholder: "e.g., Eiffel Tower",
      },
    ],
    outputType: "AR Annotated Image",
    difficulty: "medium",
    tags: ["ar", "augmented reality", "annotation", "location-based"],
    author: "@bilawalsidhu",
    sourceUrl: "https://x.com/bilawalsidhu/status/1960529167742853378",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case3/output.jpg",
  },
  {
    id: "isometric-models",
    title: "Extract 3D Buildings/Make Isometric Models",
    description:
      "Extract objects like buildings from an image and turn them into isometric models.",
    category: "3D & Models",
    prompt: "Make Image Daytime and Isometric [Building Only]",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image containing the object to extract",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Object to make isometric (e.g., Building, Vehicle)",
        required: true,
        placeholder: "Building Only",
      },
    ],
    outputType: "Isometric Model",
    difficulty: "medium",
    tags: ["3d", "isometric", "model", "building", "extraction"],
    author: "@Zieeett",
    sourceUrl: "https://x.com/Zieeett/status/1960420874806247762",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case4/output2.jpg",
  },
  {
    id: "photos-in-eras",
    title: "Photos of Yourself in Different Eras",
    description:
      "Recreate a portrait in the style of a different historical era.",
    category: "Photo Editing",
    prompt:
      "Change the characer's style to [1970]'s classical [male] style\n\nAdd [long curly] hair, \n[long mustache], \nchange the background to the iconic [californian summer landscape]\n\nDon't change the character's face",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Portrait photo",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Era (e.g., 1970)",
        required: true,
        placeholder: "1970",
      },
      {
        key: "text2",
        type: "text",
        description: "Style (e.g., male, female)",
        required: true,
        placeholder: "male",
      },
      {
        key: "text3",
        type: "text",
        description: "Hair style",
        required: true,
        placeholder: "long curly",
      },
      {
        key: "text4",
        type: "text",
        description: "Facial hair",
        required: false,
        placeholder: "long mustache",
      },
      {
        key: "text5",
        type: "text",
        description: "Background",
        required: true,
        placeholder: "californian summer landscape",
      },
    ],
    outputType: "Era-Styled Photo",
    difficulty: "medium",
    tags: ["photo editing", "style transfer", "vintage", "portrait"],
    author: "@AmirMushich",
    sourceUrl: "https://x.com/AmirMushich/status/1960810850224091439",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case5/output.jpg",
  },
  {
    id: "multi-reference-image-gen",
    title: "Multi-Reference Image Generation",
    description:
      "Generate an image combining multiple reference images into one scene.",
    category: "Image Generation",
    prompt:
      "A model is posing and leaning against a pink bmw. She is wearing the following items, the scene is against a light grey background. The green alien is a keychain and it's attached to the pink handbag. The handbag is on the floor next to the model.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Multiple reference images",
        required: true,
      },
    ],
    outputType: "Composite Image",
    difficulty: "hard",
    tags: ["image generation", "composition", "multi-reference"],
    author: "@MrDavids1",
    sourceUrl: "https://x.com/MrDavids1/status/1960783672665128970",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case6/output.jpg",
  },
  {
    id: "auto-photo-edit",
    title: "Automatic Photo Editing",
    description: "Automatically enhance a boring or plain photo.",
    category: "Photo Editing",
    prompt:
      "This photo is very boring and plain. Enhance it! Increase the contrast, boost the colors, and improve the lighting to make it richer,You can crop and delete details that affect the composition.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image to be enhanced",
        required: true,
      },
    ],
    outputType: "Enhanced Photo",
    difficulty: "easy",
    tags: ["photo editing", "enhancement", "color correction", "contrast"],
    author: "@op7418",
    sourceUrl: "https://x.com/op7418/status/1960528616573558864",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case7/output.jpg",
  },
  {
    id: "hand-drawing-poses",
    title: "Hand Drawing Controls Multi-Character Poses",
    description:
      "Use a hand-drawn sketch to control the poses of multiple characters in an image.",
    category: "Character Design",
    prompt:
      "Have these two characters fight using the pose from Figure 3. Add appropriate visual backgrounds and scene interactions,Generated image ratio is 16:9",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character images",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Hand-drawn sketch of poses",
        required: true,
      },
    ],
    outputType: "Posed Character Scene",
    difficulty: "hard",
    tags: ["character design", "pose", "sketch", "controlnet"],
    author: "@op7418",
    sourceUrl: "https://x.com/op7418/status/1960536717242573181",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case8/output.jpg",
  },
  {
    id: "cross-view-image-gen",
    title: "Cross-View Image Generation",
    description: "Convert a ground-level photo to a top-down view.",
    category: "Image Generation",
    prompt:
      "Convert the photo to a top-down view and mark the location of the photographer.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Photo taken from the ground",
        required: true,
      },
    ],
    outputType: "Top-Down View Image",
    difficulty: "medium",
    tags: ["image generation", "top-down", "perspective", "view conversion"],
    author: "@op7418",
    sourceUrl: "https://x.com/op7418/status/1960896630586310656",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case9/output.jpg",
  },
  {
    id: "custom-character-stickers",
    title: "Custom Character Stickers",
    description:
      "Turn a character image into a web illustration style sticker.",
    category: "Illustration",
    prompt:
      "Help me turn the character into a white outline sticker similar to Figure 2. The character needs to be transformed into a web illustration style, and add a playful white outline short phrase describing the character at the bottom of the sticker.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Sticker reference image",
        required: true,
      },
    ],
    outputType: "Character Sticker",
    difficulty: "medium",
    tags: ["illustration", "sticker", "character", "style transfer"],
    author: "@op7418",
    sourceUrl: "https://x.com/op7418/status/1960385812132192509",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case10/output.jpg",
  },
  {
    id: "anime-to-coser",
    title: "Anime to Real Coser",
    description:
      "Generate a realistic photo of a cosplayer based on an anime illustration.",
    category: "Character Design",
    prompt:
      "Generate a photo of a girl cosplaying this illustration, with the background set at Comiket",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Anime illustration image",
        required: true,
      },
    ],
    outputType: "Realistic Cosplay Photo",
    difficulty: "medium",
    tags: ["character design", "cosplay", "anime", "photorealism"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1960946893971706306",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case11/output.jpg",
  },
  {
    id: "generate-character-design",
    title: "Generate Character Design",
    description:
      "Generate a full character design sheet from a reference image.",
    category: "Character Design",
    prompt:
      "Generate character design for me (Character Design)\n\nProportion design (different height comparisons, head-to-body ratio, etc.)\n\nThree views (front, side, back)\n\nExpression design (Expression Sheet) → like the image you sent\n\nPose design (Pose Sheet) → various common poses\n\nCostume design (Costume Design)",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "Character Design Sheet",
    difficulty: "hard",
    tags: [
      "character design",
      "concept art",
      "reference sheet",
      "illustration",
    ],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1960669234276753542",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case12/output.jpg",
  },
  {
    id: "color-line-art",
    title: "Color Line Art with Color Palette",
    description: "Color a line art image using a specific color palette.",
    category: "Illustration",
    prompt:
      "Accurately use the color palette from Figure 2 to color the character in Figure 1",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Line art image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Color palette image",
        required: true,
      },
    ],
    outputType: "Colored Illustration",
    difficulty: "medium",
    tags: ["illustration", "coloring", "line art", "color palette"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1960652077891510752",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case13/input.jpg",
  },
  {
    id: "article-infographic",
    title: "Article Infographic",
    description: "Generate an infographic from the content of an article.",
    category: "Data Visualization",
    prompt:
      "Generate an infographic for the article content\nRequirements:\n1. Translate the content into English and extract key information from the article\n2. Keep the content in the image concise, only retaining the main title\n3. Use English text in the image\n4. Add rich and cute cartoon characters and elements",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Article/blog content",
        required: true,
      },
    ],
    outputType: "Infographic Image",
    difficulty: "hard",
    tags: ["data visualization", "infographic", "article", "summary"],
    author: "@黄建同学",
    sourceUrl: "https://weibo.com/5648162302/5204549851155423",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case14/output.jpg",
  },
  {
    id: "change-hairstyles",
    title: "Change Multiple Hairstyles",
    description: "Generate a grid of a person with different hairstyles.",
    category: "Photo Editing",
    prompt:
      "Generate avatars of this person with different hairstyles in a 3x3 grid format",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Portrait image",
        required: true,
      },
    ],
    outputType: "Image Grid of Hairstyles",
    difficulty: "easy",
    tags: ["photo editing", "hairstyle", "portrait", "avatar"],
    author: "@balconychy",
    sourceUrl: "https://x.com/balconychy/status/1960665038504779923",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case15/output.jpg",
  },
  {
    id: "model-annotation-diagram",
    title: "Model Annotation Explanation Diagram",
    description:
      "Draw a model for an academic presentation with annotations and explanations.",
    category: "Data Visualization",
    prompt:
      "Draw [3D human organ model display example heart] for academic presentation, with annotations and explanations, suitable for showcasing its principles and [each organ's] functions, very realistic, high-definition picture quality",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Model to showcase",
        required: true,
        placeholder: "3D human organ model display example heart",
      },
      {
        key: "text2",
        type: "text",
        description: "Functions to explain",
        required: true,
        placeholder: "each organ's",
      },
    ],
    outputType: "Annotated Diagram",
    difficulty: "hard",
    tags: [
      "data visualization",
      "diagram",
      "academic",
      "annotation",
      "3d model",
    ],
    author: "@berryxia_ai",
    sourceUrl: "https://x.com/berryxia_ai/status/1960708465586004305",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case16/output.jpg",
  },
  {
    id: "custom-marble-sculpture",
    title: "Custom Marble Sculpture",
    description:
      "Create a photorealistic marble sculpture from a reference image.",
    category: "3D & Models",
    prompt:
      "A photorealistic image of an ultra-detailed sculpture of the subject in image made of shining marble. The sculpture should display smooth and reflective marble surface, emphasizing its luster and artistic quality. The background should be a plain, dark, and elegant setting to highlight the sculpture. The lighting should be dramatic, casting soft shadows to enhance the three-dimensional feel of the sculpture.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image for the sculpture",
        required: true,
      },
    ],
    outputType: "Sculpture Image",
    difficulty: "medium",
    tags: ["3d", "sculpture", "marble", "photorealism", "art"],
    author: "@umesh_ai",
    sourceUrl: "https://x.com/umesh_ai/status/1960370946562564353",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case17/output.jpg",
  },
  {
    id: "cook-from-ingredients",
    title: "Cook Based on Ingredients",
    description: "Create a delicious meal from a photo of ingredients.",
    category: "Food",
    prompt:
      "make me a delicious lunch with these ingredients, and put it on a plate , zoomed in view of the plate, remove the other plates and ingredients.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Photo with various ingredients",
        required: true,
      },
    ],
    outputType: "Image of a Meal",
    difficulty: "easy",
    tags: ["food", "cooking", "recipe", "ingredients"],
    author: "@Gdgtify",
    sourceUrl: "https://x.com/Gdgtify/status/1960907695348691075",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case18/input1.jpg",
  },
  {
    id: "math-problem-reasoning",
    title: "Math Problem Reasoning",
    description: "Solve a math problem from an image and write the answer.",
    category: "Education",
    prompt:
      "Write the answer to the problem in the corresponding position based on the question",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image of a math problem",
        required: true,
      },
    ],
    outputType: "Solved Math Problem Image",
    difficulty: "medium",
    tags: ["education", "math", "problem solving", "ocr"],
    author: "@Gorden Sun",
    sourceUrl: "https://www.xiaohongshu.com/explore/68ade0e7000000001d036677",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case19/output.jpg",
  },
  {
    id: "old-photo-colorization",
    title: "Old Photo Colorization",
    description: "Restore and colorize an old black and white photo.",
    category: "Photo Editing",
    prompt: "restore and colorize this photo.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Old photo to restore",
        required: true,
      },
    ],
    outputType: "Colorized Photo",
    difficulty: "easy",
    tags: ["photo editing", "restoration", "colorization", "vintage"],
    author: "@GeminiApp",
    sourceUrl: "https://x.com/GeminiApp/status/1960347483021959197",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case20/output.jpg",
  },
  {
    id: "ootd-outfit",
    title: "OOTD Outfit",
    description:
      "Dress a person in an outfit from another image for an OOTD-style photo.",
    category: "Fashion",
    prompt:
      "Choose the person in Image 1 and dress them in all the clothing and accessories from Image 2. Shoot a series of realistic OOTD-style photos outdoors, using natural lighting, a stylish street style, and a blurred background. The person should maintain their original appearance, but the final image should look like a real photo.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Person image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Clothing and accessories image",
        required: true,
      },
    ],
    outputType: "OOTD Photo",
    difficulty: "hard",
    tags: ["fashion", "ootd", "style", "virtual try-on"],
    author: "@302.AI",
    sourceUrl:
      "https://medium.com/%40302.AI/google-nano-banana-vs-qwen-gpt-flux-topping-the-image-editing-leaderboard-96038b01bdcd",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case21/input.jpg",
  },
  {
    id: "character-clothing-change",
    title: "Character Clothing Change",
    description: "Change the clothing of a person in an image.",
    category: "Fashion",
    prompt:
      "Replace the person's clothing in the input image with the target clothing shown in the reference image. Keep the person's pose, facial expression, background, and overall realism unchanged. Make the new clothing fit naturally on the person's body.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Person image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Target clothing image",
        required: true,
      },
    ],
    outputType: "Image with Changed Clothing",
    difficulty: "medium",
    tags: ["fashion", "clothing", "virtual try-on", "photo editing"],
    author: "@skirano",
    sourceUrl: "https://x.com/skirano/status/1960343968320737397",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case22/output.jpg",
  },
  {
    id: "multi-view-generation",
    title: "Multi-View Result Generation",
    description:
      "Generate multiple views (front, rear, side, etc.) of an object.",
    category: "3D & Models",
    prompt:
      "Generate the Front, Rear, Left, Right, Top, Bottom views on white. Evenly spaced. Consistent subject. Isometric Perspective Equivalence.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image of the object",
        required: true,
      },
    ],
    outputType: "Multi-View Image Sheet",
    difficulty: "hard",
    tags: ["3d", "model", "multi-view", "product design", "turntable"],
    author: "@Error_HTTP_404",
    sourceUrl: "https://x.com/Error_HTTP_404/status/1960405116701303294",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case23/output.jpg",
  },
  {
    id: "movie-storyboard",
    title: "Movie Storyboard",
    description:
      "Create a multi-panel storyboard for a film noir detective story.",
    category: "Storytelling",
    prompt:
      "Create an addictively intriguing 12 part story with 12 images with these two characters in a classic black and white film noir detective story. Make it about missing treasure that they get clues for throughout the story.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image with two characters",
        required: true,
      },
    ],
    outputType: "Storyboard Image",
    difficulty: "hard",
    tags: ["storytelling", "storyboard", "film noir", "comic"],
    author: "@GeminiApp",
    sourceUrl: "https://x.com/GeminiApp",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case24/output.jpg",
  },
  {
    id: "character-pose-modification",
    title: "Character Pose Modification",
    description:
      "Modify the pose of a character in an image, such as their gaze direction.",
    category: "Photo Editing",
    prompt: "Have the person in the picture look straight ahead",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image of the character",
        required: true,
      },
    ],
    outputType: "Image with Modified Pose",
    difficulty: "easy",
    tags: ["photo editing", "pose", "character", "inpainting"],
    author: "@arrakis_ai",
    sourceUrl: "https://x.com/arrakis_ai/status/1955901155726516652",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case25/input.jpg",
  },
  {
    id: "image-from-line-drawing",
    title: "Generate image from line drawing",
    description:
      "Generate a realistic image by combining a line drawing pose and a reference character.",
    category: "Character Design",
    prompt:
      "Change the pose of the person in Figure 1 to that of Figure 2, and shoot in a professional studio",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Line drawing for the pose",
        required: true,
      },
    ],
    outputType: "Posed Character Image",
    difficulty: "hard",
    tags: ["character design", "pose", "line art", "controlnet"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961024423596872184",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case26/output.jpg",
  },
  {
    id: "add-watermark",
    title: "Add Watermark to Image",
    description: "Add a repeating text watermark across an entire image.",
    category: "Utilities",
    prompt:
      "Watermark the word ‘TRUMP’ over and over again across the whole image.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Watermark text",
        required: true,
        placeholder: "TRUMP",
      },
    ],
    outputType: "Watermarked Image",
    difficulty: "easy",
    tags: ["utilities", "watermark", "text", "image editing"],
    author: "@AiMachete",
    sourceUrl: "https://x.com/AiMachete/status/1963038793705128219",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case27/output.jpg",
  },
  {
    id: "knowledge-infographic",
    title: "Knowledge Reasoning Image Generation",
    description: "Create an infographic based on general knowledge questions.",
    category: "Data Visualization",
    prompt: "Make me an infographic of 5 tallest buildings in the world",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Topic for the infographic",
        required: true,
        placeholder: "5 tallest buildings in the world",
      },
    ],
    outputType: "Infographic Image",
    difficulty: "medium",
    tags: ["data visualization", "infographic", "knowledge", "chart"],
    author: "@icreatelife",
    sourceUrl: "https://x.com/icreatelife/status/1962998951948517428",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case28/output.jpg",
  },
  {
    id: "red-pen-annotations",
    title: "Red Pen Annotations",
    description:
      "Analyze an image and use a virtual red pen to mark areas for improvement.",
    category: "Analysis",
    prompt: "Analyze this image. Use red pen to denote where you can improve.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image to analyze",
        required: true,
      },
    ],
    outputType: "Annotated Image",
    difficulty: "medium",
    tags: ["analysis", "annotation", "feedback", "red pen"],
    author: "@AiMachete",
    sourceUrl: "https://x.com/AiMachete/status/1962356993550643355",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case29/output.jpg",
  },
  {
    id: "explosive-food-ad",
    title: "Explosive Food Ad",
    description:
      "Create a dramatic food advertisement with exploding ingredients.",
    category: "Food",
    prompt:
      "Photograph this product in a dramatic modern scene accompanied by explosive outward dynamic arrangement of the key ingredients fresh and raw flying around the product signifying its freshness and nutritional value.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Product image",
        required: true,
      },
    ],
    outputType: "Food Advertisement Image",
    difficulty: "medium",
    tags: ["food", "advertisement", "product photography", "dramatic"],
    author: "@icreatelife",
    sourceUrl: "https://x.com/icreatelife/status/1962724040205803773",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case30/output.jpg",
  },
  {
    id: "create-comic-book",
    title: "Create Comic Book",
    description:
      "Create a superhero comic book strip from an image, complete with a story.",
    category: "Storytelling",
    prompt:
      "Based on the uploaded image, make a comic book strip, add text, write a compelling story. I want a superhero comic book.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image for the comic",
        required: true,
      },
    ],
    outputType: "Comic Book Strip",
    difficulty: "hard",
    tags: ["storytelling", "comic", "superhero", "illustration"],
    author: "@icreatelife",
    sourceUrl: "https://x.com/icreatelife/status/1961977580849873169",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case31/output.jpg",
  },
  {
    id: "action-figure",
    title: "Action Figure",
    description:
      "Create a custom action figure of a person with specific accessories.",
    category: "3D & Models",
    prompt:
      "make an action figure of me that says [“AI Evangelist - Kris”] and features [coffee, turtle, laptop, phone and headphones]",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image of the person",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Text on the packaging",
        required: true,
        placeholder: "“AI Evangelist - Kris”",
      },
      {
        key: "text2",
        type: "text",
        description: "Accessories to include",
        required: true,
        placeholder: "coffee, turtle, laptop, phone and headphones",
      },
    ],
    outputType: "Action Figure Packaging Image",
    difficulty: "medium",
    tags: ["3d", "action figure", "toy", "packaging", "custom"],
    author: "@icreatelife",
    sourceUrl: "https://x.com/icreatelife/status/1961653618529935720",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case32/output.jpg",
  },
  {
    id: "map-to-isometric",
    title: "Map to Isometric Buildings",
    description:
      "Convert a map location into an isometric image of the landmark.",
    category: "3D & Models",
    prompt:
      "Take this location and make the landmark an isometric image (building only), in the style of the game Theme Park",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Map reference image",
        required: true,
      },
    ],
    outputType: "Isometric Building Image",
    difficulty: "medium",
    tags: ["3d", "isometric", "map", "building", "game art"],
    author: "@demishassabis",
    sourceUrl: "https://x.com/demishassabis/status/1961077016830083103",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case33/output.jpg",
  },
  {
    id: "control-character-expression",
    title: "Reference Image Controls Character Expression",
    description:
      "Change a character's expression based on a reference expression image.",
    category: "Character Design",
    prompt:
      "Character reference from Image 1 / Change to the expression from Image 2",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Expression reference image",
        required: true,
      },
    ],
    outputType: "Character with New Expression",
    difficulty: "medium",
    tags: ["character design", "expression", "face", "style transfer"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1963156830458085674",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case34/case.jpg",
  },
  {
    id: "illustration-process-panel",
    title: "Illustration Drawing Process Four-Panel",
    description:
      "Generate a four-panel image showing the drawing process of a character.",
    category: "Illustration",
    prompt:
      "Generate a four-panel drawing process for the character: Step 1: Line art, Step 2: Flat colors, Step 3: Add shadows, Step 4: Refine and complete. No text.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "Four-Panel Process Image",
    difficulty: "medium",
    tags: ["illustration", "drawing process", "tutorial", "four-panel"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961772524611768452",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case35/case.jpg",
  },
  {
    id: "virtual-makeup-try-on",
    title: "Virtual Makeup Try-On",
    description: "Apply makeup from a reference image to a character.",
    category: "Fashion",
    prompt:
      "Apply the makeup from Image 2 to the character in Image 1, while maintaining the pose from Image 1.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Makeup reference image",
        required: true,
      },
    ],
    outputType: "Character with Makeup",
    difficulty: "medium",
    tags: ["fashion", "makeup", "virtual try-on", "beauty"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1962778069242126824",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case36/case.jpg",
  },
  {
    id: "makeup-analysis",
    title: "Makeup Analysis",
    description:
      "Analyze a portrait and use a red pen to suggest makeup improvements.",
    category: "Analysis",
    prompt:
      "Analyze this image. Use a red pen to mark areas that can be improved",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "Annotated Makeup Analysis",
    difficulty: "medium",
    tags: ["analysis", "makeup", "beauty", "annotation", "feedback"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1962784384693739621",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case37/output.jpg",
  },
  {
    id: "google-maps-middle-earth",
    title: "Google Maps View of Middle-earth",
    description:
      "Generate a fictional Google Street View shot from a fantasy world.",
    category: "Image Generation",
    prompt:
      "Dashcam Google Street View shot | [Hobbiton Street] | [hobbits carrying out daily tasks like gardening and smoking pipes] | [Sunny weather]",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Location in the fantasy world",
        required: true,
        placeholder: "Hobbiton Street",
      },
      {
        key: "text2",
        type: "text",
        description: "Scene details",
        required: true,
        placeholder: "hobbits carrying out daily tasks",
      },
      {
        key: "text3",
        type: "text",
        description: "Weather conditions",
        required: true,
        placeholder: "Sunny weather",
      },
    ],
    outputType: "Fictional Street View Image",
    difficulty: "medium",
    tags: ["image generation", "fantasy", "street view", "lord of the rings"],
    author: "@TechHallo",
    sourceUrl: "https://x.com/techhalla/status/1962292272227102941",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case38/output.jpg",
  },
  {
    id: "typographic-illustration",
    title: "Typographic Illustration Generation",
    description:
      "Create an illustration using only the letters from a specific phrase.",
    category: "Illustration",
    prompt:
      "Create a minimalist black-and-white typographic illustration of the scene riding a bicycle using only the letters in the phrase ['riding a bicycle'] . Each letter should be creatively shaped or positioned to form the elements of the scene, such as the bicycle, the rider, and the ground.",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Phrase to use for the illustration",
        required: true,
        placeholder: "riding a bicycle",
      },
    ],
    outputType: "Typographic Illustration",
    difficulty: "hard",
    tags: ["illustration", "typography", "art", "minimalist"],
    author: "@Umesh",
    sourceUrl: "https://x.com/umesh_ai/status/1961110485543371145",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case39/output.jpg",
  },
  {
    id: "multiple-character-poses",
    title: "Multiple Character Poses Generation",
    description:
      "Create a pose sheet with various poses for a given character.",
    category: "Character Design",
    prompt:
      "Please create a pose sheet for this illustration, making various poses!",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "Character Pose Sheet",
    difficulty: "medium",
    tags: ["character design", "pose sheet", "illustration", "concept art"],
    author: "@tapehead_Lab",
    sourceUrl: "https://x.com/tapehead_Lab/status/1960878455299694639",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case40/case.jpg",
  },
  {
    id: "product-packaging-generation",
    title: "Product Packaging Generation",
    description: "Apply a design to a product packaging, like a can.",
    category: "Product Design",
    prompt:
      "Apply the design from Image 1 to the can in Image 2, and place it in a minimalist design setting, professional photography",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Design reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Packaging reference image (e.g., a can)",
        required: true,
      },
    ],
    outputType: "Product Packaging Mockup",
    difficulty: "medium",
    tags: ["product design", "packaging", "mockup", "branding"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1962763864875167971",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case41/case.jpg",
  },
  {
    id: "overlay-filter-material",
    title: "Overlay Filter/Material",
    description:
      "Overlay a filter or material effect from one image onto another.",
    category: "Photo Editing",
    prompt: "Overlay the [glass] effect from Image 2 onto the photo in Image 1",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Filter/material reference image",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Filter/material to apply",
        required: true,
        placeholder: "glass",
      },
    ],
    outputType: "Image with Overlay Effect",
    difficulty: "medium",
    tags: ["photo editing", "filter", "material", "style transfer", "texture"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1962520937011855793",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case42/case.jpg",
  },
  {
    id: "control-character-face-shape",
    title: "Control Character Face Shape",
    description:
      "Design a chibi version of a character with a specific face shape.",
    category: "Character Design",
    prompt:
      "Design the character from Image 1 as a chibi version according to the face shape from Image 2",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Face shape reference image",
        required: true,
      },
    ],
    outputType: "Chibi Character Image",
    difficulty: "hard",
    tags: ["character design", "chibi", "face shape", "illustration"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961802767493939632",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case43/case.jpg",
  },
  {
    id: "lighting-control",
    title: "Lighting Control",
    description: "Apply the lighting from a reference image to a character.",
    category: "Photo Editing",
    prompt:
      "Change the character from Image 1 to the lighting from Image 2, with dark areas as shadows",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Lighting reference image",
        required: true,
      },
    ],
    outputType: "Image with New Lighting",
    difficulty: "hard",
    tags: ["photo editing", "lighting", "style transfer", "relighting"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961779457372602725",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case44/case.jpg",
  },
  {
    id: "lego-minifigure",
    title: "LEGO Minifigure",
    description:
      "Transform a person into a LEGO minifigure in a packaging box.",
    category: "3D & Models",
    prompt:
      'Transform the person in the photo into a LEGO minifigure packaging box style, presented in isometric perspective. Label the box with the title "ZHOGUE". Inside the box, display the LEGO minifigure based on the person, along with their accessories.',
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image of the person",
        required: true,
      },
    ],
    outputType: "LEGO Minifigure Packaging",
    difficulty: "medium",
    tags: ["3d", "lego", "minifigure", "toy", "packaging"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961395526198595771",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case45/output.jpg",
  },
  {
    id: "gundam-model-figure",
    title: "Gundam Model Figure",
    description: "Transform a person into a Gundam model kit.",
    category: "3D & Models",
    prompt:
      'Transform the person in the photo into a Gundam model kit packaging box style, presented in isometric perspective. Label the box with the title "ZHOGUE". Inside the box, display a Gundam-style mechanical figure based on the person, along with their equipment.',
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image of the person",
        required: true,
      },
    ],
    outputType: "Gundam Model Kit Packaging",
    difficulty: "medium",
    tags: ["3d", "gundam", "mecha", "model kit", "packaging"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1961412823340265509",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case46/output.jpg",
  },
  {
    id: "hardware-exploded-view",
    title: "Hardware Exploded View",
    description:
      "Create an exploded view of a piece of hardware like a DSLR camera.",
    category: "Technical Illustration",
    prompt:
      "Exploded view of a DSLR showing all its accessories and internal components such as lens, filter,  internal components, lens, sensor, screws, buttons, viewfinder, housing, and circuit board. Maintain a clean, minimalist aesthetic on a white background, with each part clearly separated and labeled. The style should be reminiscent of a professional product manual or a high-end technical illustration.",
    inputs: [
      {
        key: "none",
        type: "none",
        description: "No input image needed",
        required: false,
      },
    ],
    outputType: "Exploded View Illustration",
    difficulty: "hard",
    tags: [
      "technical illustration",
      "exploded view",
      "hardware",
      "product design",
    ],
    author: "@AIimagined",
    sourceUrl: "https://x.com/AIimagined/status/1961431851245211958",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case47/output.jpg",
  },
  {
    id: "food-calorie-annotation",
    title: "Food Calorie Annotation",
    description:
      "Annotate a meal with food names and approximate calorie counts.",
    category: "Food",
    prompt:
      "annotate this meal with names of food and calorie density and approximate calories",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Food reference image",
        required: true,
      },
    ],
    outputType: "Annotated Food Image",
    difficulty: "medium",
    tags: ["food", "calories", "nutrition", "annotation", "health"],
    author: "@icreatelife",
    sourceUrl: "https://x.com/icreatelife/status/1963646757222715516",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case48/output.jpg",
  },
  {
    id: "extract-subject-transparent",
    title: "Extract Subject and Place on Transparent Layer",
    description:
      "Extract a subject from an image and place it on a transparent background.",
    category: "Utilities",
    prompt: "extract the [samurai] and put transparent background",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "Subject to extract",
        required: true,
        placeholder: "samurai",
      },
    ],
    outputType: "Image with Transparent Background",
    difficulty: "easy",
    tags: ["utilities", "background removal", "extraction", "transparent"],
    author: "@nglprz",
    sourceUrl: "https://x.com/nglprz/status/1961494974555394068",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case49/output.jpg",
  },
  {
    id: "image-outpainting-repair",
    title: "Image Outpainting Repair",
    description: "Repair the transparent (checkerboard) parts of an image.",
    category: "Photo Editing",
    prompt:
      "Repair the checkerboard (transparent) parts of the image and restore a complete, coherent photo.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Image with transparent areas",
        required: true,
      },
    ],
    outputType: "Repaired Image",
    difficulty: "medium",
    tags: [
      "photo editing",
      "outpainting",
      "inpainting",
      "repair",
      "restoration",
    ],
    author: "@bwabbage",
    sourceUrl: "https://x.com/bwabbage/status/1962903212937130450",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case50/output.jpg",
  },
  {
    id: "ancient-map-to-photo",
    title: "Ancient Map → Historical Scene Photo",
    description:
      "Turn a historical map or scene into a modern-looking photograph.",
    category: "Image Generation",
    prompt:
      "full colour photograph. New Amsterdam in 1660. make sure it's full modern colors as if it's a photograph taken today.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Historical reference image (e.g., old map)",
        required: true,
      },
    ],
    outputType: "Modern-Looking Historical Photo",
    difficulty: "medium",
    tags: ["image generation", "history", "photorealism", "reimagined"],
    author: "@levelsio",
    sourceUrl: "https://x.com/levelsio/status/1961595333034598487",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case51/output.jpg",
  },
  {
    id: "fashion-moodboard-collage",
    title: "Fashion Moodboard Collage",
    description: "Create a fashion moodboard collage from a portrait.",
    category: "Fashion",
    prompt:
      "A fashion mood board collage. Surround a portrait with cutouts of the individual items the model is wearing. Add handwritten notes and sketches in a playful, marker-style font, and include the brand names of the clothing items.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Portrait reference image",
        required: true,
      },
    ],
    outputType: "Fashion Moodboard",
    difficulty: "hard",
    tags: ["fashion", "moodboard", "collage", "design"],
    author: "@tetumemo",
    sourceUrl: "https://x.com/tetumemo/status/1962480699904282861",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case52/output.jpg",
  },
  {
    id: "cute-product-photo",
    title: "Delicate Cute Product Photo",
    description:
      "Create a high-resolution, cute advertising photo of a miniature product.",
    category: "Product Design",
    prompt:
      "A high-resolution advertising photograph of a realistic, miniature [PRODUCT] held delicately between a person's thumb and index finger.  clean and white background, studio lighting, soft shadows. The overall aesthetic is cute, premium, and delicate.",
    inputs: [
      {
        key: "text1",
        type: "text",
        description: "Product to showcase",
        required: true,
        placeholder: "perfume bottle",
      },
    ],
    outputType: "Product Photo",
    difficulty: "medium",
    tags: [
      "product design",
      "advertisement",
      "photography",
      "miniature",
      "cute",
    ],
    author: "@azed_ai",
    sourceUrl: "https://x.com/azed_ai/status/1962878353784066342",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case53/output.jpg",
  },
  {
    id: "anime-statue-in-real-life",
    title: "Place Anime Statue in Real Life",
    description:
      "Place a gigantic statue of an anime character in a real-world location.",
    category: "Image Generation",
    prompt:
      "A realistic photographic work. A gigantic statue of this person has been placed in a square in the center of Tokyo, with people looking up at it.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Anime character reference image",
        required: true,
      },
    ],
    outputType: "Realistic Composite Photo",
    difficulty: "medium",
    tags: ["image generation", "photorealism", "composite", "anime", "statue"],
    author: "@riddi0908",
    sourceUrl: "https://x.com/riddi0908/status/1963758463135412699",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case54/output.jpg",
  },
  {
    id: "create-itasha-car",
    title: "Create an Itasha Car",
    description: "Design an anime-themed 'itasha' car.",
    category: "Product Design",
    prompt:
      "Create a professional photograph of a sporty car with anime-style character artwork as itasha (painted car) design, shot at a famous tourist destination or scenic landmark. The car features large, prominent artwork of the character on its sides, hood, and roof.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Anime character reference image",
        required: true,
      },
    ],
    outputType: "Itasha Car Photo",
    difficulty: "medium",
    tags: ["product design", "car", "itasha", "anime", "photorealism"],
    author: "@riddi0908",
    sourceUrl: "https://x.com/riddi0908/status/1963422536819249239",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case55/output.jpg",
  },
  {
    id: "manga-composition",
    title: "Manga Composition",
    description:
      "Create a manga-style composition using a character and a scene reference.",
    category: "Illustration",
    prompt:
      "Place the character from Image 1 into the scene composition of Image 2, in a manga style.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Scene composition reference image",
        required: true,
      },
    ],
    outputType: "Manga Style Image",
    difficulty: "hard",
    tags: ["illustration", "manga", "composition", "style transfer"],
    author: "@namaedousiyoka",
    sourceUrl: "https://x.com/namaedousiyoka/status/1962461786181161340",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case56/input.jpg",
  },
  {
    id: "manga-style-conversion",
    title: "Manga Style Conversion",
    description:
      "Convert a photo into a black-and-white manga-style line drawing.",
    category: "Illustration",
    prompt:
      "Convert the input photo into a black-and-white manga-style line drawing.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference photo",
        required: true,
      },
    ],
    outputType: "Manga Line Drawing",
    difficulty: "easy",
    tags: ["illustration", "manga", "style transfer", "line art"],
    author: "@nobisiro_2023",
    sourceUrl: "https://x.com/nobisiro_2023/status/1961231347986698371",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case57/output.jpg",
  },
  {
    id: "isometric-holographic-wireframe",
    title: "Isometric Holographic Wireframe",
    description:
      "Convert a line-art image into an isometric, holographic wireframe.",
    category: "3D & Models",
    prompt:
      "Based on the uploaded image, convert it into a holographic depiction using wireframe lines only.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Line-art reference image",
        required: true,
      },
    ],
    outputType: "Holographic Wireframe Image",
    difficulty: "medium",
    tags: ["3d", "wireframe", "holographic", "isometric", "sci-fi"],
    author: "@tetumemo",
    sourceUrl: "https://x.com/tetumemo/status/1964574226155000312",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case58/output.jpg",
  },
  {
    id: "minecraft-style-scene",
    title: "Minecraft-Style Scene Generation",
    description:
      "Create an isometric, HD-2D Minecraft-style image of a real-world landmark.",
    category: "Game Art",
    prompt:
      "Using this location, create an isometric HD-2D Minecraft-style image of the landmark (buildings only).",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Google Maps reference image",
        required: true,
      },
    ],
    outputType: "Minecraft-Style Image",
    difficulty: "medium",
    tags: ["game art", "minecraft", "isometric", "pixel art", "hd-2d"],
    author: "@tetumemo",
    sourceUrl: "https://x.com/tetumemo/status/1964860047705743700",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case59/output.jpg",
  },
  {
    id: "apply-material-to-logo",
    title: "Apply Material Sphere to Logo",
    description:
      "Apply a material from a sphere image to a logo, rendering it in 3D.",
    category: "3D & Models",
    prompt:
      "Apply the material from Image 2 to the logo in Image 1, present it as a 3D object, render in a C4D-like style, with a solid-color background.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Logo reference image",
        required: true,
      },
      {
        key: "image2",
        type: "image",
        description: "Material sphere image",
        required: true,
      },
    ],
    outputType: "3D Logo with Material",
    difficulty: "hard",
    tags: ["3d", "logo", "material", "texture", "c4d"],
    author: "@ZHO_ZHO_ZHO",
    sourceUrl: "https://x.com/ZHO_ZHO_ZHO/status/1964995347505352794",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case60/case.jpg",
  },
  {
    id: "floor-plan-3d-render",
    title: "Floor Plan 3D Render",
    description:
      "Convert a 2D residential floor plan into a photo-realistic 3D rendering.",
    category: "Architecture",
    prompt:
      "Convert this residential floor plan into an isometric, photo-realistic 3D rendering of the house.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Floor plan reference image",
        required: true,
      },
    ],
    outputType: "3D Architectural Rendering",
    difficulty: "medium",
    tags: ["architecture", "3d", "floor plan", "rendering", "isometric"],
    author: "@op7418",
    sourceUrl: "https://x.com/op7418/status/1961329148271513695",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case61/output.jpg",
  },
  {
    id: "reset-camera-parameters",
    title: "Reset Camera Parameters",
    description:
      "Change the virtual camera settings of an image (ISO, F-stop, etc.).",
    category: "Photo Editing",
    prompt: "RAW-ISO [100] - [F2.8-1/200 24mm] settings",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image",
        required: true,
      },
      {
        key: "text1",
        type: "text",
        description: "ISO setting",
        required: true,
        placeholder: "100",
      },
      {
        key: "text2",
        type: "text",
        description: "Aperture, Shutter Speed, Focal Length",
        required: true,
        placeholder: "F2.8-1/200 24mm",
      },
    ],
    outputType: "Image with New Camera Settings",
    difficulty: "hard",
    tags: ["photo editing", "camera", "iso", "aperture", "photography"],
    author: "@hckinz",
    sourceUrl: "https://x.com/hckinz/status/1962803203063586895",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case62/output.jpg",
  },
  {
    id: "create-id-photo",
    title: "Create an ID Photo",
    description: "Create a professional ID photo from a portrait.",
    category: "Utilities",
    prompt:
      "Crop the head and create a 2-inch ID photo with:\n  1. Blue background\n  2. Professional business attire\n  3. Frontal face\n  4. Slight smile",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Portrait reference image",
        required: true,
      },
    ],
    outputType: "ID Photo",
    difficulty: "easy",
    tags: ["utilities", "id photo", "portrait", "business"],
    author: "@songguoxiansen",
    sourceUrl: "https://x.com/songguoxiansen/status/1963602241610551609",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case63/output.jpg",
  },
  {
    id: "scene-a6-folding-card",
    title: "Scene A6 Folding Card",
    description:
      "Design an A6 folding card that reveals a 3D scene when opened.",
    category: "Product Design",
    prompt:
      "Draw an A6 folding card: when opened, it reveals a complete 3D spherical tiny house with a miniature paper garden and a bonsai tree inside.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Reference image for inspiration",
        required: true,
      },
    ],
    outputType: "Folding Card Design",
    difficulty: "hard",
    tags: ["product design", "papercraft", "card", "3d", "diorama"],
    author: "@Gdgtify",
    sourceUrl: "https://x.com/Gdgtify/status/19649795223709287319",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case64/output.jpg",
  },
  {
    id: "design-chess-set",
    title: "Design a Chess Set",
    description: "Design a 3D-printable chess set inspired by an image.",
    category: "Product Design",
    prompt:
      "Draw a chessboard and a set of 3D-printable chess pieces inspired by this image.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Inspiration reference image",
        required: true,
      },
    ],
    outputType: "Chess Set Design",
    difficulty: "medium",
    tags: ["product design", "chess", "3d printing", "board game"],
    author: "@Gdgtify",
    sourceUrl: "https://x.com/Gdgtify/status/1964679042994442454",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case65/case.jpg",
  },
  {
    id: "split-contrast-style-photo",
    title: "Split-Contrast Style Photo",
    description: "Create a photo of a room split between two different eras.",
    category: "Photo Editing",
    prompt:
      "A photo of a bedroom split down the middle: the left side is 2018 and the right side is 1964, in the same room.",
    inputs: [
      {
        key: "none",
        type: "none",
        description: "No input image needed",
        required: false,
      },
    ],
    outputType: "Split-Era Photo",
    difficulty: "medium",
    tags: [
      "photo editing",
      "style transfer",
      "vintage",
      "composite",
      "concept",
    ],
    author: "@fofrAI",
    sourceUrl: "https://x.com/fofrAI/status/1964818395381248397",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case66/case.jpg",
  },
  {
    id: "jewelry-collection-design",
    title: "Jewelry Collection Design",
    description: "Transform an image into a 5-piece jewelry collection.",
    category: "Product Design",
    prompt: "Transform this image into a 5-piece jewelry collection.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Inspiration reference image",
        required: true,
      },
    ],
    outputType: "Jewelry Collection Design",
    difficulty: "medium",
    tags: ["product design", "jewelry", "fashion", "collection"],
    author: "@Gdgtify",
    sourceUrl: "https://x.com/Gdgtify/status/1964419331342909777",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case67/output.jpg",
  },
  {
    id: "merchandise-design",
    title: "Merchandise Design",
    description: "Create merchandise using a character image.",
    category: "Product Design",
    prompt: "Create merchandise using this character image.",
    inputs: [
      {
        key: "image1",
        type: "image",
        description: "Character reference image",
        required: true,
      },
    ],
    outputType: "Merchandise Mockups",
    difficulty: "easy",
    tags: ["product design", "merchandise", "branding", "character"],
    author: "@0xFramer",
    sourceUrl: "https://x.com/0xFramer/status/1964992117324886349",
    imageUrl:
      "https://github.com/PicoTrex/Awesome-Nano-Banana-images/raw/main/images/case68/output.jpg",
  },
];

export const getAllCategories = (): string[] => {
  return [...new Set(aiImagePrompts.map((prompt) => prompt.category))].sort();
};

export const searchPrompts = (
  query: string,
  category: string
): ImagePrompt[] => {
  const lowerQuery = query.toLowerCase();
  return aiImagePrompts.filter((prompt) => {
    const inCategory = category === "All" || prompt.category === category;
    const matchesQuery =
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery));
    return inCategory && matchesQuery;
  });
};
