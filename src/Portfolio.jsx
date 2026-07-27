import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { X, ArrowRight, Triangle, Bot, Type, Square, Circle as CircleIcon, Eye, EyeOff, Sun, Moon } from "lucide-react";

const LazyIframe = ({ src, ...props }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible || !ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "100% 0px" });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible]);
  return <iframe ref={ref} src={visible ? src : undefined} {...props}/>;
};

const GalleryCarousel = ({ items, fg, sub }) => {
  const [idx, setIdx] = useState(0);
  const g = items[idx];
  const n = g.images.length;
  const gh = n>=4?"18vh":n===3?"22vh":n===2?"32vh":"52vh";
  const gmw = `${Math.floor(88/n)}vw`;
  const go = d => setIdx(i => (i+d+items.length)%items.length);
  return (
    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
      <h3 style={{fontSize:"clamp(20px,2vw,30px)",fontWeight:800,color:fg,margin:0}}>{g.title}</h3>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"flex-start",gap:"1.5vw",width:"100%"}}>
        {g.images.map(src=>(
          <img key={src} src={src} alt={g.title} loading="lazy" style={{height:gh,width:"auto",maxWidth:gmw}}/>
        ))}
      </div>
      <p style={{fontSize:14,lineHeight:1.7,color:sub,maxWidth:760,textAlign:"center",margin:0}}>{g.desc}</p>
      <div style={{display:"flex",alignItems:"center",gap:20,marginTop:8}}>
        <div onClick={()=>go(-1)} style={{cursor:"pointer",padding:8,opacity:0.7,display:"flex"}}>
          <ArrowRight size={20} color={fg} style={{transform:"rotate(180deg)"}}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          {items.map((_,i)=>(
            <div key={i} onClick={()=>setIdx(i)} style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",
              backgroundColor:fg,opacity:i===idx?1:0.3}}/>
          ))}
        </div>
        <div onClick={()=>go(1)} style={{cursor:"pointer",padding:8,opacity:0.7,display:"flex"}}>
          <ArrowRight size={20} color={fg}/>
        </div>
      </div>
    </div>
  );
};

const GHIcon = ({ size=14, color="#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const TRACKS = [
{ id:"web", label:"WEB DESIGN & DEV", short:"WEB", cover:"WEB DESIGN\n& DEV", color:"#E63946", projects:[
    { name:"CLIMBLOG", desc:"Computer-vision hold detection + AI-generated challenges — built full-stack",
      why:"Climbers often lose track of what they've climbed and rarely get objective feedback — logging routes by hand is tedious and progress feels invisible. ClimbLog turns a wall photo into automatic hold detection, gamifies your climbing history against real mountain heights, and uses AI to keep training fresh with personalized challenges. The scattered colored dots throughout the UI echo real climbing holds on a wall, tying the visual language back to the sport itself.",
      bg:"#E63946", gh:"climblog", ai:true, live:"https://climblog2025.netlify.app/",
      image:"/climblog/home.png", stack:["React","TypeScript","Tailwind CSS","Firebase","Roboflow CV","Google Gemini"],
      gallery:[
        { type:"video", src:"/climblog/hold.mp4", poster:"/climblog/hold-result.png", title:"Hold Detection",
          desc:"Upload a wall photo and a Roboflow computer-vision model detects and boxes every hold in real time." },
        { type:"video", src:"/climblog/challenge.mp4", title:"AI-Generated Challenges",
          desc:"Google Gemini generates personalized climbing challenges — swipe to save, skip, or start." },
        { type:"image", src:"/climblog/logbook.png", title:"Logbook",
          desc:"Track every route climbed, filterable by difficulty, location, and time." },
        { type:"image", src:"/climblog/profile.png", title:"Profile & Achievements",
          desc:"Gamified progress — total height climbed compared against real mountains, streaks, and badges." },
      ] },
    { name:"BAREBELLS", desc:"\"Protein That Tastes Like Dessert\" — a full AI-assisted brand campaign",
      why:"A speculative brand campaign for Barebells protein bars built for a Designer role application, positioning the product as \"Protein That Tastes Like Dessert.\" It spans outdoor lightbox/metro ads, a five-flavor product lineup, an interactive spin-the-wheel lucky draw, and a campaign video — designed, animated, and shipped as a full interactive website in six hours using an AI-assisted workflow (Lovart and GPT Image for design, Meshy AI for 3D, Kling AI and CapCut for video, Three.js/GSAP/Lenis for the site itself).",
      bg:"#8B0000", gh:"barebellsdesigncase", ai:true, live:"https://lesley-qing-gu.github.io/barebellsdesigncase/",
      image:"/barebells/barebells.png",
      stack:["Lovart","GPT Image","Meshy AI","Kling AI","Three.js","GSAP","Lenis"],
      gallery:[
        { type:"video", src:"/barebells/barebells.mp4", title:"Live Campaign Video",
          desc:"" },
        // { type:"embed", src:"https://lesley-qing-gu.github.io/barebellsdesigncase/", title:"Live Interactive Site", solo:true, desc:"" }
        { type:"image", src:"/barebells/HowIMade.png", title:"How I Made It", solo:true, layout:"side",
          desc:"Posters were designed in Lovart and polished with GPT Image, then adapted across formats using Lovart's templates. The campaign video was storyboarded with Claude, generated frame-by-frame in GPT Image, and animated with Kling AI. The 3D product model came from Meshy AI, rendered live with Three.js — and the whole interactive site was built with Amazon Q, GSAP, and Lenis." },
      ] },
    { name:"PAPERBULLET", desc:"Film criticism & editorial platform with a serverless CMS",
      why: "Small independent media outlets often struggle with server maintenance costs. PaperBullet was built for a Chinese independent film media team to cover overseas film festivals. Designed as a pure frontend application, it completely eliminates backend server costs while still functioning as a robust CMS. Editors can log in via a password and use a familiar, Word-like rich text editor to easily publish, modify, and delete articles, reports, and rating charts on the go.",
      bg:"#C1121F", gh:"paperbullet", ai:false, live:"https://lesley-qing-gu.github.io/paperbullet/",
      image:"/paperbullet-media/home.png", stack:["React","TypeScript","Vite","Tailwind CSS","Framer Motion"],
      gallery:[
        { type:"video", src:"/paperbullet-media/report.mp4", title:"Festival Reports & Rating Charts",
          desc:"Interactive viewing of comprehensive overseas film festival coverage and critic rating grids." },
        { type:"video", src:"/paperbullet-media/admin.mp4", title:"Serverless Admin CMS",
          desc:"A password-protected dashboard allowing editors to manage content through a seamless, Word-style text editor without a traditional backend." },
      ] },
    { name:"OUTSEA", desc:"Visually-driven, archive-focused website for my independent film podcast", 
      why:"I co-host OutSea with Tiki across Stockholm and Amsterdam to explore European film festivals and arthouse cinemas. I designed this site not just as a landing page, but as an interactive visual archive of our cinematic journey. Using canvas-drawn pixel waves, film grain masks, and ambient ocean soundscapes driven by GSAP, it offers a tactile, immersive experience that preserves our memories and bridges the geographical gap between us and our listeners.",
      bg:"#A4161A", gh:"OutSea", ai:false, live:"https://lesley-qing-gu.github.io/OutSea/",
      image:"/outsea/giflogo.gif", imageScale:0.5, stack:["HTML","CSS","JavaScript","GSAP","ScrollTrigger","Canvas API"],
      gallery:[
        { type:"video", src:"/outsea/OutSea.mp4", title:"",
          desc:"" },
      ] },
    { name:"SOLARIS", desc:"Independent cinephile collective platform with automated design-to-dev workflows", 
      why:"As a dedicated cinephile, I manage SOLARIS — a Chinese cinephile collective dedicated to the discussion and exploration of cinema. I built this site to serve as an evolving archive for our film ratings, score sheets, and editorial content. To streamline our editorial workflow, I developed custom tools to bridge data and design: one plugin fetches movie metadata as JSON to sync with the website, while a custom Figma plugin automatically populates selected design templates using this JSON data. Coupled with Node.js scripts for data processing and static HTML generation for SEO, the platform runs on a highly automated, self-sustaining pipeline.",
      bg:"#BA1826", gh:"solaris-site", ai:false, live:"https://solaris-cinema.art/",
      image:"/images/solaris.mp4", stack:["React", "TypeScript", "Tailwind CSS", "Node.js", "Figma Plugin API", "SEO"],
      gallery:[
        { type:"image", src:"/images/json.png", title:"Data Fetching & Sync Plugin",
          desc:"A custom tool that fetches movie metadata in JSON format and seamlessly syncs it to the website's data pipeline." },
        { type:"image", src:"/images/chajian.png", title:"Automated Figma Layout Generator",
          desc:"A workflow plugin that reads the JSON movie data and automatically populates selected Figma templates for rapid, consistent score sheet design." },
      ] },
    { name:"SVENSKA LYSSNA", desc:"AI-powered Swedish audio learning with real-time sync & interactive dictionary",
      why:"Learning a new language through audio is powerful but hard to review. Svenska Lyssna turns any Swedish audio into an interactive study tool. Powered by Gemini 3 Flash, it features highly accurate transcription, real-time sentence highlighting synced to playback, and an interactive dictionary for instant IPA and multi-language translations.",
      bg:"#9A031E", gh:"SvenskaLyssna", ai:true, live:"https://ai.studio/apps/2261bbb3-61a1-433c-9979-faf78eec3ee2?fullscreenApplet=true", image:"/images/svenskalyssna.mp4",
      stack:["React","TypeScript","Tailwind CSS","Google Gemini","Motion"], gallery:[] },
    { name:"SVENSKA\nKOMPIS", desc:"AI Swedish tutor featuring cultural scenarios & multimodal pronunciation evaluation",
      why:"Practicing a language in realistic scenarios and getting objective feedback is rare outside a classroom. SvenskaKompis bridges this gap with an AI-powered Scenario Builder for cultural immersion and a multimodal Speech Lab. Using Gemini's advanced multimodal capabilities, it listens to your pronunciation, analyzes prosody, and provides real-time scoring to help you master authentic Swedish.",
      bg:"#B90429", gh:"SvenskaKompis", ai:true, live:"https://ai.studio/apps/c4e2552b-eed1-4cb4-8700-fb7a136c02b6?fullscreenApplet=true", image:"/images/svenskakompis.mp4",
      stack:["React","TypeScript","Tailwind CSS","Gemini 3 Pro/Flash","Web Audio API"], gallery:[] },
    { name:"CINEGLOBE", desc:"Interactive 3D WebGL globe for real-time global cinema discovery",
      why:"Finding what's currently playing in theaters around the world usually requires checking dozens of local listings. CineGlobe aggregates this into a premium, interactive 3D globe. Powered by Google Gemini with live Search grounding, it fetches real-time theatrical release data from sources like IMDb, allowing film enthusiasts to intuitively explore global cinema trends.",
      bg:"#780000", gh:"CineGlobe", ai:true, live:"https://ai.studio/apps/05ea7f3c-a456-416a-bac8-874d9748c95b?fullscreenApplet=true", image:"/images/cineglobe.mp4",
      stack:["React","Three.js (Globe.gl)","Tailwind CSS","Google Gemini","Search Grounding"], gallery:[]},
    { name:"CAHIERS DU CINÉMA COVER", desc:"AI-powered editorial design studio inspired by Nouvelle Vague",
      why:"Film enthusiasts rarely get to see themselves in cinema history. This specialized design studio transforms personal portraits into iconic French film magazine covers. Using Google Gemini for precise AI background segmentation and HTML5 Canvas for real-time image processing (B&W conversion, blend modes), it merges AI capabilities with meticulous editorial typography.",
      bg:"#9D0208", gh:"Cahiers-du-Cinema-Cover-Generator", ai:true, live:"https://ai.studio/apps/5e3ab94f-7e6f-48fc-bf74-509bbc3109a2?fullscreenApplet=true", image:"/images/cover.mp4", stack:["React","TypeScript","Google Gemini","HTML5 Canvas","html-to-image"], gallery:[] },
    { name:"PATTERN SYNC", desc:"Two-player emotional resonance game and visual similarity analyzer",
      why:"To explore how digital interfaces can foster human empathy, I designed Pattern Sync as part of my work as a Creation Master at Asta. Players express their emotional rhythms through drawing across three progressive canvas levels. A custom visual algorithm then compares the shape, color, and tempo of both players' inputs to calculate an 'Emotional Sync Score', ultimately merging their distinct strokes into a shared digital artwork.",
      bg:"#BF233C", gh:"PatternSync", ai:true, live:"https://astapatternsync.netlify.app/",
      image:"/images/patternsync.mp4", stack:["Flutter","Flame Engine","Dart","Custom Canvas API"], gallery:[] },
    { name:"LOVE ALGORITHM", desc:"MBTI-inspired relationship matching system & interactive questionnaire",
      why:"Combining psychological frameworks with interactive design, I built this typing and matching system for Asta. Users answer a curated set of questions to determine their relationship archetype. A custom rule-based algorithm then evaluates the compatibility between different types, delivering instant sync scores and personalized insights into their relationship dynamics.",
      bg:"#B22222", gh:"LoveAlgorithm", ai:false, live:"https://astaeventpage.netlify.app/",
      image:"/images/lovealgorithm.mp4", stack:["React","TypeScript","Tailwind CSS","Vite","Node.js"], gallery:[] },
    { name:"SUBTITLE PLAYER", desc:"SRT-based text playback tool for film studies and kinetic typography",
      why:"Designed for film studies and text-driven visual projects, Subtitle Player is a lightweight, serverless tool that displays text according to SRT timecodes. It solves the issue of garbled text by supporting robust encoding detection (including GBK/GB2312) and offers a cinematic, distraction-free playback experience on both desktop and mobile.",
      bg:"#660708", gh:"subtitle-player", ai:false, live:"https://lesley-qing-gu.github.io/subtitle-player/",
      image:"/images/subtitleplayer.mp4", stack:["HTML5","CSS3","JavaScript","SRT Parsing","Regex"], gallery:[] },
    { name:"MOLEME", desc:"Satirical Windows 98-styled workplace survival terminal & anti-burnout tool",
      why:"Modern productivity tools often increase workplace anxiety. MoLeMe is a satirical, retro-styled 'slacking' terminal designed for psychological relief. Wrapped in a nostalgic Windows 98 aesthetic, it features a real-time 'paid-to-slack' calculator, a digital wooden fish for karma, and a highly effective 'Panic Mode' that instantly displays fake complex business charts when the boss walks by.",
      bg:"#E63946", gh:"MoLeMe", ai:true, live:"https://ai.studio/apps/574bdc14-c0ba-45f5-beba-85f08edc947d?fullscreenApplet=true", image:"/images/moleme.mp4",
      stack:["React 19","Tailwind CSS","CSS Animations","SVG Filters","LocalStorage"], gallery:[] },
    // { name:"SINOQUEER", desc:"Community website (previous version)", bg:"#B22234", gh:"sinoqueer-web" },
    { name:"CANNES VIZ", desc:"Interactive data visualization exploring 80 years of Cannes Film Festival history",
      why:"An interactive data visualization platform exploring the 80-year history of the Cannes Film Festival, analyzing award preferences and cross-cultural rating disparities across decades of official selections.",
      bg:"#E63946", gh:"", ai:false, live:"https://blueunderjiji.github.io/VisDesign/",
      image:"/images/Cannes.png", stack:["Data Visualization","Interactive Design","Web Scraping","Film History"], gallery:[] },
  ]},
  { id:"uxui", label:"UX/UI DESIGN", short:"UX/UI", cover:"UX/UI\nDESIGN", color:"#F27B21", projects:[
    { name:"ERICSSON ADAPTIVE UI", desc:"AI-driven adaptive interface design for telecom radio test systems, bridging UX research and LLM-powered frontend engineering",
      why:"Radio network engineers at Ericsson work with complex test systems daily, yet the existing interfaces are static and fail to adapt to individual operator workflows. This leads to cognitive overload, inefficiency, and errors during critical network testing. My master's thesis explored how Large Language Models could power an adaptive UI layer that responds to user context in real time. By combining contextual inquiry with operators and hands-on React/TypeScript implementation, I designed and built an interface that learns from user behavior and restructures itself to match each operator's mental model — proving that AI can make complex enterprise tools feel intuitive without sacrificing power.",
      bg:"#F27B21", gh:"", ai:true, live:"",
      image:"/images/Ericsson.png", stack:["React", "TypeScript", "LLM APIs", "Figma", "Contextual Inquiry", "SUS", "NASA-TLX"],
      gallery:[] },
    { name:"ECOCAN", desc:"Family financial habit builder with dual parent-child interfaces",
      why:"Economic management for families with small children often lacks a clear system, leading to confusion over allowances and chores. EcoCan bridges this gap by offering two tailored experiences: a functional dashboard for parents to assign tasks, and a gamified, intuitive interface for children to learn financial literacy. By visualizing savings goals and integrating an AI chatbot that explains money concepts through engaging stories, it turns everyday household routines into a continuous financial education.",
      bg:"#E26E00", gh:"", ai:true, live:"https://www.figma.com/design/sX2Qy8yDrwwKhs2tD3GMvm/EcoCan---Final-Version?node-id=0-1&t=kNqfIBuspwdIQ9Xh-1",
      image:"/ecocan/logo.png", stack:["Figma", "User Research", "Prototyping", "Usability Testing"],
      gallery:[
        { type:"image", src:"/ecocan/paperprototype.png", title:"Paper Prototyping & Ideation",
          desc:"We began by mapping out the core dual-interface task flows using rapid paper sketches, focusing on laying out the fundamental information architecture for both parents and children." },
        { type:"image", src:"/ecocan/lowprototype.png", title:"Low-Fidelity Validation & Testing",
          desc:"The initial concepts were translated into low-fidelity digital wireframes to conduct early usability testing with design students and real families, helping us identify interaction bottlenecks and usability pain points." },
        { type:"image", src:"/ecocan/parent.png", title:"Final Design: Parent's Version",
          desc:"The functional dashboard empowers parents to manage family economics efficiently. It features a streamlined Job Board for assigning chores and allowances, allowing parents to effortlessly track their children's progress and approve completed tasks." },
        { type:"image", src:"/ecocan/children.png", title:"Final Design: Children's Version",
          desc:"The children's interface delivers a gamified financial education system. It includes a visual Goals page for tracking personal savings, interactive task acceptance, and an AI chatbot that explains complex money concepts through engaging, illustrated stories." }
      ] },
    { name:"SJ INCLUSIVE BOOKING", desc:"Research-driven accessibility evaluation and inclusive redesign of Sweden's SJ train booking service",
      why:"Public transport must be accessible to all, yet standard digital booking flows often overwhelm users with cognitive or physical disabilities due to visual clutter, time constraints, and ambiguous icons. Following the European Accessibility Act and participatory design principles, our team evaluated the SJ booking service. We discovered a profound insight: 'Universal Design' is often a myth, as the needs of different disabilities frequently contradict one another. To address this, we designed a specialized, step-by-step audio-assisted flow that prioritizes psychological safety, clear system status, and customizable interaction paces.",
      bg:"#D4551B", gh:"", ai:false, live:"https://www.figma.com/proto/GoAIWxcNbEkwsI9w0hN2VS/SJ-Prototype?node-id=54-344&p=f&t=xTIxLuPOo5aYMo0R-0&scaling=scale-down&content-scaling=fixed&page-id=54%3A343&starting-point-node-id=54%3A344",
      image:"/sj/cover.png", stack:["Accessibility", "Participatory Design", "WAVE Audits", "Wizard of Oz", "UX Research"],
      gallery:[
        { type:"image", src:"/sj/audit.png", title:"Automated Audits & Journey Mapping",
          desc:"We utilized tools like WAVE to uncover critical underlying code accessibility issues (e.g., missing language tags and contrast failures). We then mapped the entire user journey to pinpoint moments of cognitive overload during the ticket selection process." },
        { type:"image", src:"/sj/research.png", title:"Participatory Research & The 'Conflict' Insight",
          desc:"Through semi-structured interviews and affinity mapping with users facing different barriers, we uncovered that accommodating one disability often contradicts the needs of another, proving that specialized, adaptable pathways are more effective than a one-size-fits-all approach." },
        { type:"image", src:"/sj/testing.png", title:"Wizard of Oz Audio Testing",
          desc:"We explored a voice-assisted booking concept using the 'Wizard of Oz' testing method to simulate system interactions. This revealed a crucial usability need: users required a highly visible distinction between when the system was speaking and when it was listening." },
        { type:"image", src:"/sj/final-ui.png", title:"Inclusive Step-by-Step UI",
          desc:"The final high-fidelity design breaks the booking process into single, focused steps. It removes time constraints, replaces ambiguous icons with explicit text, and introduces clear, distinct visual states for audio interactions (Talking to You vs. Listening to You)." }
      ] },
    { name:"LI CAI+ (FINANCE+)", desc:"A family-bridged financial management and consumption platform for college students",
      why:"College students often face 'irrational' or 'advanced' consumption due to a lack of financial literacy and trust in digital finance. To address this, we designed 'Li Cai+', a conceptual platform that bridges consumption with financial management. Through quantitative research and interviews, we discovered that family influence is the primary driver of students' financial habits. By leveraging the 'family unit' as a bridge, we developed a Trust Factor Model and a Full-link Service Blueprint to build internal and external trust, ultimately guiding students toward rational consumption and sustainable financial habits.",
      bg:"#F27B21", gh:"", ai:false, live:"",
      image:"/licai/cover.png", stack:["Service Design", "User Research", "Trust Strategy", "UI Design"],
      gallery:[
        { type:"image", src:"/licai/trustfactor.png", title:"Insight & Trust Factor Model",
          desc:"To tackle the lack of trust in digital finance, we leveraged the 'family unit' as a bridge. We developed a comprehensive Trust Factor Model addressing User, Platform, and Product levels to systematically build internal and external trust." },
        { type:"image", src:"/licai/strategy.png", title:"Full-link Service Blueprint",
          desc:"With the trust foundation established, we mapped the user's cognitive journey (Discovery, Decision Making, Use, Retained) to create a continuous incentive mechanism and guide rational financial decision-making." },
        { type:"image", src:"/licai/prototyping.png", title:"Prototyping & Usability Testing",
          desc:"We translated our strategic models into functional low-fidelity wireframes, conducting rigorous usability testing to refine the information architecture and feature set before moving to final production." },
        { type:"image", src:"/licai/final-ui.png", title:"Final Platform Ecosystem",
          desc:"The high-fidelity design seamlessly integrates four core modules: an Entering Page, Personal Finance, Family Finance (the trust bridge), and a Financial Consumer Mall, closing the loop between earning, saving, and rational spending." }
      ] },
  ]},
  { id:"product", label:"PRODUCT DESIGN", short:"PRODUCT", cover:"PRODUCT\nDESIGN", color:"#FCD116", projects:[
    { name:"MyWay", desc:"A 3D and audio-enhanced transportation learning kit for visually impaired teenagers",
      why:"Independent travel is crucial for visually impaired teenagers but is deficient in current Orientation and Mobility (O&M) education. To address this, we developed 'MyWay' through a co-design process with experts and students from a school for the blind. It is a modular 3D transportation learning kit combining Braille, tactile paving, and spatial audio (ambient, information, and explanation). By simulating complex multi-layered transit scenarios (e.g., bus, taxi, subway), MyWay effectively helps students comprehend transit regulations, improves spatial cognition, and builds their courage for independent travel.",
      bg:"#FCD116", gh:"", ai:false, live:"",
      image:"/myway/cover.jpg", stack:["Accessible Design", "Co-design", "Tangible Interaction", "Spatial Audio", "User Research"],
      gallery:[
        { type:"image", src:"/myway/research.png", title:"Co-design Process & User Research", h:30,
          desc:"We conducted semi-structured interviews and workshops with visually impaired teenagers and O&M experts to identify requirements and map effective forms of tactile and auditory feedback for spatial experience." },
        { type:"image", src:"/myway/tangible.png", title:"3D Modular Tactile Map", h:30,
          desc:"The tangible component features modules with Braille and tactile paving. Its inclusive, modular structure allows for customized assembly by both sighted and visually impaired users to recreate real-world transit routes." },
        { type:"image", src:"/myway/audio.png", title:"Spatial Audio Integration",
          desc:"Drawing from participant insights, we designed a spatial audio system differentiated into ambient, information, and explanation audio. This synchronizes with tactile exploration to provide comprehensive directional guidance." },
        { type:"image", src:"/myway/structure.png", title:"Scenario Construction & Usage Flow",
          desc:"By combining tangible modules and spatial audio, MyWay constructs complex multi-layered transit scenarios like taking a bus, hailing a taxi, or riding a subway. The user's interaction flow seamlessly integrates touching the road, understanding and moving modules, and listening to audio guidance." },
        { type:"image", src:"/myway/evaluation.jpg", title:"Evaluation & Educational Impact", solo:true,
          desc:"A three-round evaluation with 25 participants demonstrated MyWay's superiority over traditional 3D printed tools. Through peer-assisted learning, it significantly cultivated students' independent learning skills and spatial understanding." },
        { type:"youtube", src:"https://www.youtube.com/embed/iUnqmPxARBc", title:"Project Overview & Demonstration", solo:true, desc:"" }
      ] },
    { name:"FURHAT ROBOTICS", desc:"Multimodal social robot prototyping — redesigning hardware, interaction, and office integration for human-robot communication",
      why:"Social robots need to feel alive to earn human trust, yet most HRI prototypes treat speech, gaze, and gesture as separate channels. At Furhat Robotics I worked across the full stack — a Kotlin multimodal system syncing voice, gaze, and expression in real time, a WebSocket office integration for calendar and file control by voice, plus hardware redesigns (a 360° rotating base, a sturdier support bracket, and 3D-printed RFID interfaces for physical, screen-free interaction).",
      bg:"#FFC300", gh:"", ai:true, live:"",
      image:"/images/Furhat.jpg", stack:["Kotlin", "WebSocket", "Google Calendar API", "3D Printing", "RFID", "Rapid Prototyping", "HRI", "Industrial Design"],
      gallery:[
        { type:"youtube", src:"https://www.youtube.com/embed/JxL8rh0GkZA", title:"Furhat Internship Demo Reel", solo:true, desc:"" }
      ] },
    { name:"BAMBOO SHELTER", desc:"Moisture Reactive Flexible Umbrella System",
      why:"Bamboo Shelter is an eco-friendly, moisture-reactive rain shelter that uses the natural toughness of bamboo, shaped into a lightweight, feather-like form that blends into natural scenery. A raindrop sensor triggers a transmission mechanism that automatically and elegantly retracts the bamboo blades into a shelter the moment rain begins to fall — validated through structural, circuit, and waterproof-fabric prototyping to make it sustainable and low-maintenance for parks, campuses, and courtyards.",
      bg:"#E9C46A", gh:"", ai:false, live:"",
      image:"/bamboo/cover.jpg", stack:["Bamboo Fabrication","Arduino","Raindrop Sensor","Stepper Motor","Mechanical Prototyping","Material Testing","Sustainable Design"],
      gallery:[
        { type:"image", src:"/bamboo/design.png", title:"Definition & Design Sketch", solo:true,
          desc:"Bamboo Shelter uses the natural toughness of bamboo poles as its main structure, automatically retracting into a feather-like form the moment rain touches its leaves." },
        { type:"image", src:"/bamboo/structure.png", title:"Structural Experiment", solo:true,
          desc:"Iterating through linkage vs. bamboo-joint main-rod structures, blade frame reinforcement, and motor/transmission-sheave/rope combinations to find a reliable, elegant retracting mechanism." },
        { type:"image", src:"/bamboo/technical.png", title:"Technical Experiment", solo:true,
          desc:"Comparing raindrop and temperature/humidity sensors, servo vs. stepper motors, and transmission ropes, then wiring the final Arduino-based sensing and motor-control circuit." },
        { type:"image", src:"/bamboo/fabric.png", title:"Waterproof Fabric Experiment", solo:true,
          desc:"Testing Japanese paper, bamboo paper, Dupont paper, and shoji paper for waterproofing, flexibility, aesthetics, durability, and opacity to find the best blade material." },
        { type:"youtube", src:"https://www.youtube.com/embed/XQfVJ6iemeM", title:"Bamboo Shelter Demo", solo:true, desc:"" }
      ] },
    { name:"WOMENWISE", desc:"Multi-agent AI workflow system for trustworthy, fault-tolerant code generation — 2nd Prize, AI-Assisted Workflow Coding Hackathon",
      why:"At the AI-Assisted Workflow Coding Hackathon, our first-time team WomenWise (Liyuan Sun, Qing Gu, Huijie Wang, Yiyan He, Zhaoxia Quan) tackled a core problem in AI-assisted development: LLM-generated code is often unreliable and hard to trust in production. We built a multi-agent workflow orchestrated with Temporal, where one agent generates code via an LLM, a second agent reviews and suggests improvements, and a third safely executes the result inside a sandbox — with a human-in-the-loop approval step and fault-tolerant retries at every stage. A demo dashboard built with Express.js and the Temporal UI let judges watch the whole pipeline execute in real time. The project won 2nd Prize.",
      bg:"#FFE066", gh:"aaaaabiang/WomenWise-in-hackathon1001", ai:true, live:"",
      stack:["Temporal Workflows","TypeScript","Python","Go","Express.js","LLM Agents","Multi-Agent Orchestration"],
      gallery:[
        { type:"youtube", src:"https://www.youtube.com/embed/52rfYguyue4", title:"WomenWise Hackathon Demo", solo:true, desc:"" }
      ] },
    { name:"SONGGUO", desc:"AI mindfulness sleep-aid pillow — psychology-first sleep therapy in a consumer product",
      why:"More than 300 million people in China suffer from sleep disorders, 60% of them rooted in psychological factors — yet existing consumer sleep aids only treat symptoms mechanically. Songguo AI Sleep Pillow takes a psychology-first approach instead, translating professional-grade multi-sensory therapy into an AI mindfulness sleep-aid algorithm and a validated 5+1 sensory experience.",
      bg:"#FCD116", gh:"", ai:true, live:"", image:"/songguo/cover.png", carousel:true,
      stack:["MBSR Algorithm","Sleep Monitoring","Hardware Design","AI Personalization","Product Strategy"],
      gallery:[
        { type:"group", title:"The Problem", solo:true, images:["/songguo/problem-disorders.png","/songguo/problem-market.png","/songguo/problem-comparison.png","/songguo/idea-chair.png"],
          desc:"More than 300 million people in China suffer from sleep disorders, and WHO statistics show 60% are caused by psychological factors. As sleep awareness grows, China's sleep economy is expected to exceed 550 billion yuan in 2024 — yet the two dominant categories of consumer sleep aids fall short: invasive aids risk long-term health harm, while non-invasive aids (herbs, pillow materials) only treat symptoms mechanically without addressing the psychological root causes of insomnia." },
        { type:"group", title:"From Idea to Product", solo:true, images:["/songguo/idea-5plus1.png","/songguo/idea-senses.png","/songguo/idea-wake.png"],
          desc:"Professional-grade multi-sensory sleep aid chairs — common in psychological counseling but priced around 200,000 yuan — inspired us to ask: could this be made consumer-grade? Songguo AI Sleep Pillow answers that, creating a 5+1 sensory sleep experience across sight, hearing, smell, touch, and heat: gently massaging and warming the shoulders and neck, releasing calming fragrance, and generating AI personalized white noise. In the morning, instead of a jarring alarm, sunrise light and birdsong wake users from light sleep, alongside a sleep report and personalized recommendations in the companion app." },
        { type:"group", title:"Core Technology", solo:true, images:["/songguo/tech-mbsr.png","/songguo/tech-dualcycle.png"],
          desc:"The 5+1 sensory experience is only the delivery layer — the core is our AI mindfulness stress-reduction sleep algorithm, integrating MBSR (Mindfulness-Based Stress Reduction) therapy to model user emotion and adapt accordingly. Alongside it, our dual-cycle sleep monitoring algorithm pairs real-time breathing- and heart-rate-based sleep tracking (Cycle A) with therapy-effect detection (Cycle B), continuously correcting the sleep aid program based on feedback quality." },
        { type:"group", title:"Validated Results", solo:true, images:["/songguo/results.png"],
          desc:"Compared to popular sleep aid pillows on the market, third-party authoritative testing found Songguo users fell asleep 36% faster, gained 67% more deep sleep, and saw a 97% improvement in daytime function scores — objective, verified evidence that psychology-first sleep aid works." },
        { type:"group", title:"Business Model", solo:true, images:["/songguo/business-model.png"],
          desc:"A dual product line: a 599 RMB base version with DIY customization and a 30-day sleep trial to lower purchase hesitation, and a premium version for business elites with fully open software/hardware and door-to-door custom pillow fitting." },
        { type:"group", title:"Partnerships", solo:true, images:["/songguo/partnership-enterprise.png","/songguo/partnership-giftbox.png"],
          desc:"Songguo has signed strategic partnerships with well-known organizations — including YuanZheng Hotel, Hangzhou Zhixiang Technology, and Xinchang County — using their credibility to build industry word-of-mouth. With Zhixiang Technology specifically, Songguo also launched a Mid-Autumn Festival gift-box edition, pairing sleep tech with a premium corporate-gifting experience." },
        { type:"group", title:"Go-to-Market & Vision", solo:true, images:["/songguo/gtm-channels.png","/songguo/gtm-jobs.png"],
          desc:"Songguo runs sales through international crowdfunding platforms and partners with tech- and health-focused self-media and KOLs/KOCs to build trust and community. As the venture grows, it aims to create 300+ new jobs across R&D, sales, and customer service, driving the broader sleep-aid industry forward. Songguo AI Sleep Pillow is entirely designed and built by our undergraduate team — carrying the mission to help China sleep well, sleep deeply, and love sleep again." }
      ] },
  ]},
  { id:"visual", label:"VISUAL DESIGN", short:"VISUAL", cover:"VISUAL\nDESIGN", color:"#3EAE2B", projects:[
    { name:"FILM SCREENING", desc:"An independent film exhibition exploring memory, archive, and image through works by Wang Bing, Feng Yan, Tan Mo, and Zhang Xinyang.",
      why:"Within the context of Chinese independent cinema, 'recording' is never merely a technical act of preserving reality, but a slow resistance against grand narratives and the erasure of historical noise. Spanning different eras, these four films form a cinematic archive outside of mainstream narratives, questioning how independent cinema can survive and where to find those who remain 'left behind'.",
      bg:"#2A9D8F", gh:"", ai:false, live:"", image:"/film/cover.jpg",
      stack:["Independent Cinema","Exhibition Design","Editorial Design","Curatorial Text"],
      gallery:[
        { type:"group", solo:true, title:"Poster, Program Book & Schedule", images:["/film/poster.jpg","/film/changkan.jpg","/film/timetable.jpg"] },
        { type:"group", solo:true, title:"Ticket Stubs", images:["/film/Group 8.jpg","/film/Group 9.jpg","/film/Group 10.jpg","/film/Group 11.jpg"] },
        { type:"image", src:"/film/zhoubian.jpg", title:"Merchandise" }
      ] },
    { name:"POSTER GALLERY", desc:"Event & recruitment posters for film screenings, reading seminars, and campus culture",
      why:"A recurring poster design practice spanning film club recruitment, screening events, reading seminars, and campus cultural programming — blending collage, typography, and print traditions like paper-cutting to give each event its own visual identity.",
      bg:"#4E9F3D", gh:"", ai:false, live:"https://www.notion.so/Graphic-Design-25b688c19f488127a1c7c52e67ba2c47",
      image:"/images/haodongxi.jpg", stack:["Poster Design","Typography","Print Design","Event Branding"],
      gallery:[
        { type:"image", src:"/images/12.png", title:"Tie in Tides", h:58,
          desc:"An evocative event poster designed for the screening of the film Tie in Tides." },
        { type:"image", src:"/images/2.jpg", title:"House of Sand", h:58,
          desc:"An official promotional poster featuring a groundbreaking typographic Wuxia figure composed entirely of kinetic text elements." },
        { type:"image", src:"/images/11.jpg", title:"Ballroom Workshop", h:58,
          desc:"A playful, cat-illustrated flyer for a Ballroom Workshop in Stockholm — sharing the history of Ballroom culture, a panel connecting Chinese and Scandinavian ballroom communities, and a hands-on Vogue Femme session open to all experience levels." },
        { type:"image", src:"/images/13.jpg", title:"Printmaking", h:58,
          desc:"A promotional poster for the Queer Spring Festival workshop, transforming classic red scrolls into a vibrant rainbow spectrum merging Lunar New Year symbols with LGBTQ+ identity." },
        { type:"image", src:"/images/1.jpg", title:"Club Poster #1", h:58,
          desc:"A recruitment poster reinterpreting iconic imagery from legendary musicians and cinematic masterpieces, blending cultural nostalgia with contemporary graphic layouts." },
        { type:"image", src:"/images/3.jpg", title:"Club Poster #2", h:58,
          desc:"A recruitment poster centering on a full-spectrum, rainbow-colored human figure, symbolizing radical inclusivity and diversity of the club." },
        { type:"image", src:"/images/4.jpg", title:"Timbuktu", h:58,
          desc:"Film screening poster for Timbuktu." },
        { type:"image", src:"/images/5.jpg", title:"Notes Underground", h:58,
          desc:"A commemorative poster for the 200th anniversary of Dostoevsky's birth, for a reading seminar on Notes from Underground." },
        { type:"image", src:"/images/9.jpg", title:"Farewell Concubine", h:58,
          desc:"A striking event poster designed for a screening of the cinematic masterpiece Farewell My Concubine." },
        { type:"image", src:"/images/10.jpg", title:"Concubine Cover", h:58,
          desc:"A bespoke program cover employing a traditional Chinese paper-cutting aesthetic, featuring Consort Yu and the Hegemon-King through intricate die-cut patterns." },
        { type:"image", src:"/images/14.jpg", title:"Your Life #1", h:58,
          desc:"Film screening poster for Your Life." },
        { type:"image", src:"/images/15.jpg", title:"Your Life #2", h:58,
          desc:"Film screening poster for Your Life." },
        { type:"image", src:"/images/16.jpg", title:"Your Life #3", h:58,
          desc:"Film screening poster for Your Life." },
        { type:"image", src:"/images/6.jpg", title:"Blessing", h:58,
          desc:"An evocative event poster for the Blessing reading seminar, themed Capturing Wandering Sounds." }
      ] },
    { name:"WINTER SWIMMING", desc:"I have wanted to make a magazine of my own since 2018, and finally completed my dream in 2022. Winter Swimming, is a literary magazine.",
      why:"It was initiated by me in February 2022. My friends and I co-wrote articles, and I was responsible for typesetting and printing at last. We write comments and creations around these four topics: Fitzcarraldo, Security, Contagion, Sponge. Fitzcarraldo means the courage to do the impossible, Security is about thinking about safety environment, Contagion is all our perception of life since COVID-19, Sponge is a metaphor for the empty and arrogant state of modern people. On the inside page, I typeset according to what my friends wrote, for example, in the day of flying flies, I took the words as the path for flies to fly. Besides I drew a group photo of everyone swimming in the pool. Finally, we got all the physical book in June 2022. This magazine is an imprint of my college life, and also an indelible memory of my college life.",
      bg:"#1A9D8F", gh:"", ai:false, live:"", image:"/winterswimming/FrontCover.png",
      stack:["Book Design","Editorial Design","Typesetting","Print Production"],
      gallery:[
        { type:"image", src:"/winterswimming/FrontCover.png", title:"Cover", h:50 },
        { type:"image", src:"/winterswimming/BackCover.jpeg", title:"Back Cover", h:50 },
        { type:"image", src:"/winterswimming/Contents.jpeg", title:"Contents", h:50 },
        { type:"image", src:"/winterswimming/InsidePages1.jpeg", title:"Inside Pages 1", h:50 },
        { type:"image", src:"/winterswimming/InsidePages2.png", title:"Inside Pages 2", h:50 },
        { type:"image", src:"/winterswimming/Article1.png", title:"Article Page 1", h:50 },
        { type:"image", src:"/winterswimming/Article2.png", title:"Article Page 2", h:50 },
        { type:"image", src:"/winterswimming/Article3.png", title:"Article Page 3", h:50 },
        { type:"image", src:"/winterswimming/PrintedBook.jpeg", title:"Printed Book", h:50 }
      ] },
    { name:"Low-Cost Zine", desc:"A collection of low-cost, self-published zines and manuals designed for community workshops and grassroots events", 
      why:"I designed and produced this series of zines to support various community initiatives, including printmaking workshops and the Queer Spring Festival. Embracing the constraints of low-cost production, the design relies on bold, contrasting color blocks, striking vector illustrations, and dynamic bilingual typography to create a strong visual impact without expensive printing techniques. By utilizing accessible paper stocks and tactile DIY binding methods—such as hand-tying with twine—the project transforms budget limitations into a raw, authentic aesthetic that encourages physical interaction, collectability, and community sharing.",
      bg:"#3A9D8F", gh:"", ai:false, live:"",
      image:"/images/zine.jpg", stack:["Print Design","Editorial Design","Illustration","DIY Binding","Visual Communication"],
      gallery:[] },
    { name:"OUTSEA", desc:"Comprehensive visual identity and pixel-art branding system for an independent film podcast", 
      why:"I developed the visual identity for OutSea centering around a nostalgic yet modern pixel-art aesthetic. The design system utilizes a strict core color palette (#143FDC blue, #01C366 green, and #C86B39 orange) paired with a custom 'Dotted Songti Square' typography to establish a highly recognizable, cohesive brand. The system is modular, featuring dynamic podcast cover templates tailored for specific segments using distinct 8-bit icons. By juxtaposing these retro pixel elements with real photographic ocean textures, the design creates a unique visual language that perfectly captures our transnational cinematic journey.",
      bg:"#3EAE2B", gh:"OutSea", ai:false, live:"https://lesley-qing-gu.github.io/OutSea/",
      image:"/outsea/giflogo.gif", imageScale:0.5, stack:["Visual Identity","Pixel Art","Typography","UI/UX Design","Brand System"],
      gallery:[
        { type:"image", src:"/outsea/design.png", title:"",
          desc:"" },
      ] },
    { name:"ZJU RPG", desc:"Pixel-art RPG turning university life into a calculus battle game",
      why:"A pixel-art RPG simulating daily life at Zhejiang University, where players fight calculus problems using mathematical theorems as combat skills.",
      bg:"#3EAE2B", gh:"", ai:false, live:"https://pan.baidu.com/s/1Ao-wfYCuJfleZZ_RKkiGig?pwd=ydiz",
      image:"/images/ZJU.jpg", stack:["Pixel Art","Game Design","Narrative Design"], gallery:[] },
  ]},
  // { id:"graphic", label:"GRAPHIC DESIGN", short:"GRAPHIC", cover:"GRAPHIC\nDESIGN", color:"#2A5FD0", projects:[
  //   { name:"POSTER\nGALLERY", desc:"Selected poster works", bg:"#2A5FD0" },
  //   { name:"EXHIBITION\nGRAPHICS", desc:"Print & spatial design", bg:"#5B9BD5" },
  //   { name:"DIGITAL\nWORKS", desc:"Screen-based visual works", bg:"#1A3D7C" },
  // ]},
  { id:"research", label:"RESEARCH", short:"RESEARCH", cover:"RESEARCH", color:"#2A5FD0", projects:[
    { name:"TOUCH IS VISION", desc:"A collection of accessible-design work for visually impaired children",
      why:"This collection showcases my work in creating accessible solutions for the needs of visually impaired children, specifically focusing on areas such as inclusive transportation, geometry education, physics education, and low-cost modifications of accessibility facilities.",
      bg:"#2A5FD0", gh:"", ai:false, live:"/accessibilitydesign.pdf",
      image:"/touchisvision.png", stack:["Accessible Design","Inclusive Education","Tactile Interfaces","Assistive Technology"],
      gallery:[
        { type:"embed", src:"/accessibilitydesign.pdf", title:"Full Collection PDF", solo:true, desc:"" }
      ] },
    { name:"AR PROJECTION", desc:"HCI research on interaction dimensions and forms in AR projector systems",
      why:"HCI research investigating how interaction dimensions (2D vs. 3D) and forms (tactility vs. vision) affect user experience in AR projector systems — measuring task performance, emotion, learnability, and mental workload across 39 participants.",
      bg:"#1A3D7C", gh:"", ai:false, live:"https://www.notion.so/The-Impact-of-Interaction-Dimensions-and-Forms-of-AR-Projection-on-User-Experience-25b688c19f48817c8768ddd40e433bf2",
      image:"/images/AR.png", stack:["AR","User Experience Research","Experimental Design","HCI"], gallery:[] },
    { name:"WORKING MEMORY", desc:"Cognitive research on irrelevant-dimension processing in visual working memory",
      why:"A multi-staged cognitive research project investigating the automatic processing of object-independent dimensions in visual working memory, using Gabor patches across a series of controlled experiments.",
      bg:"#3B6EA5", gh:"", ai:false, live:"https://www.notion.so/The-Information-Processing-Mechanism-of-Irrelevant-Dimensions-in-Working-Memory-25b688c19f4881a89ad2e83f1c2af835",
      image:"/images/WM.png", stack:["Cognitive Psychology","Experimental Design","Visual Working Memory"], gallery:[] },
    { name:"EAST MEETS WEST", desc:"Cross-cultural study of emotional communication in Chinese & American film",
      why:"A psychological study exploring cultural nuances in emotional communication through film, analyzing facial expressions in Chinese and American melodramas to compare how emotion is read across cultures.",
      bg:"#2A5FD0", gh:"", ai:false, live:"https://www.notion.so/East-Meets-West-Ever-Catch-Different-Emtions-in-On-screen-Faces-25b688c19f48816f813fce91205e0e54",
      image:"/images/Emotion.png", stack:["Cross-Cultural Psychology","Facial Expression Analysis","Film Studies"], gallery:[] },
  ]},
  { id:"about", label:"ABOUT & CONTACT", short:"ABOUT", cover:"ABOUT &\nCONTACT", color:"#6B2D7B", isAbout:true, projects:[] },
];

const RECT = [
  {x:23,y:22,w:12,h:26},{x:35,y:22,w:17,h:26},
  {x:52,y:22,w:25,h:26},{x:23,y:48,w:18,h:30},
  {x:41,y:48,w:13,h:24},{x:54,y:48,w:23,h:30},
];
const CIRC = [
  {x:24,y:39,s:9},{x:32,y:29,s:15},{x:49,y:25,s:22},
  {x:24,y:59,s:16},{x:41,y:63,s:10},{x:53,y:53,s:18},
];
const MR = [0,10,26,42,50];
const FB = "#0D99FF";
const GH_USER = "Lesley-Qing-Gu";
const isDark = c => {const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);return(r*.299+g*.587+b*.114)>150;};

/* Shape morphing: square / triangle / circle all sampled to the same point count so
   clip-path can cross-fade smoothly between any pair — closing square→triangle→circle→square. */
const SHAPE_PTS = 60;
const shapeAngle = i => -Math.PI/2 + i*(2*Math.PI/SHAPE_PTS);
const superellipsePoint = (theta,n) => {
  const c=Math.cos(theta),s=Math.sin(theta);
  const x=Math.sign(c)*Math.abs(c)**(2/n), y=Math.sign(s)*Math.abs(s)**(2/n);
  return [x,y];
};
/* Sample a straight-edged polygon proportionally along each edge so vertices
   land exactly (no corner chamfering from angle-based sampling gaps). */
const edgePoints = (verts,N) => {
  const per=N/verts.length,pts=[];
  for(let e=0;e<verts.length;e++){
    const a=verts[e],b=verts[(e+1)%verts.length];
    for(let k=0;k<per;k++){
      const t=k/per;
      pts.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);
    }
  }
  return pts;
};
const toClipPath = pts => `polygon(${pts.map(([x,y])=>`${((x+1)/2*100).toFixed(2)}% ${((y+1)/2*100).toFixed(2)}%`).join(",")})`;
/* Both shapes wound clockwise starting near the top, matching the superellipse's
   angle direction, so mid-morph frames don't twist. */
const TRIANGLE_VERTS = [[0,-1],[1,1],[-1,1]];
const TRIANGLE_CLIP = toClipPath(edgePoints(TRIANGLE_VERTS,SHAPE_PTS));
const SQUARE_VERTS = [[-1,-1],[1,-1],[1,1],[-1,1]];
const radiusClip = t => {
  if(t<=0)return toClipPath(edgePoints(SQUARE_VERTS,SHAPE_PTS));
  const n = 20+t*(2-20);
  return toClipPath(Array.from({length:SHAPE_PTS},(_,i)=>superellipsePoint(shapeAngle(i),n)));
};
const RADIUS_CLIPS = MR.map(pct=>radiusClip(pct/50));

const TOOLS = [
  {id:"rect",icon:Square,key:"R"},
  {id:"triangle",icon:Triangle,key:"V"},
  {id:"ellipse",icon:CircleIcon,key:"O"},
  {id:"text",icon:Type,key:"T"},
];

const Handle = ({style:s}) => <div style={{position:"absolute",width:6,height:6,background:"#fff",border:`1.5px solid ${FB}`,borderRadius:1,zIndex:5,...s}}/>;

const WelcomeCursor = () => {
  const [pos,setPos] = useState(0);
  const path = [{x:38,y:28},{x:55,y:22},{x:62,y:40},{x:45,y:50},{x:35,y:35}];
  useEffect(()=>{const iv=setInterval(()=>setPos(p=>(p+0.002)%1),50);return()=>clearInterval(iv);},[]);
  const idx=Math.floor(pos*path.length),next=(idx+1)%path.length,t=pos*path.length-idx;
  const cx=path[idx].x+(path[next].x-path[idx].x)*t,cy=path[idx].y+(path[next].y-path[idx].y)*t;
  return (
    <div style={{position:"absolute",left:`${cx}vw`,top:`${cy}vh`,zIndex:15,pointerEvents:"none",transition:"left 0.05s linear,top 0.05s linear"}}>
      <svg width="12" height="18" viewBox="0 0 12 18" fill="#000" style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,.2))"}}>
        <path d="M0 0l12 8.5-5 1.5 3 7-3 1-3-7L0 16V0z"/>
      </svg>
      <div style={{marginLeft:14,marginTop:-6,background:"#000",color:"#fff",fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:3,whiteSpace:"nowrap"}}>Welcome</div>
    </div>
  );
};

/* Point + facing angle at distance d around a w×h rectangle perimeter, walked clockwise from top-left. */
export default function Portfolio() {
  const [morph,setMorph]=useState(0);
  const [hovered,setHovered]=useState(null);
  const [active,setActive]=useState(null);
  const [originRect,setOriginRect]=useState(null);
  const [phase,setPhase]=useState(null);
  const [show,setShow]=useState(false);
  const [tool,setTool]=useState("rect");
  const [triShape,setTriShape]=useState(false);
  const [aiOnly,setAiOnly]=useState(false);
  const [aiHint,setAiHint]=useState(false);
  const [layersOpen,setLayersOpen]=useState(false);
  const [layersHint,setLayersHint]=useState(false);
  const [ctx,setCtx]=useState(null);
  const [hidden,setHidden]=useState({});
  const [darkMode,setDarkMode]=useState(false);
  const [darkHint,setDarkHint]=useState(false);
  const scrollRef=useRef(null);
  const wheelLock=useRef(false);
  const wheelAccum=useRef(0);
  const wheelTimer=useRef(null);
  const [onCover,setOnCover]=useState(true);
  const labelWrapRefs=useRef({});
  const labelTextRefs=useRef({});
  const coverRef=useRef(null);

  const fitCover=useCallback(()=>{
    const el=coverRef.current;
    if(!el)return;
    el.style.transform="none";
    const naturalW=el.scrollWidth,naturalH=el.scrollHeight;
    if(!naturalW||!naturalH)return;
    const scaleY=(window.innerHeight*0.92)/naturalH;
    const scaleX=Math.min(scaleY,(window.innerWidth*0.94)/naturalW);
    el.style.transform=`scale(${scaleX},${scaleY})`;
  },[]);

  useLayoutEffect(()=>{
    if(phase!=="open"||!active)return;
    fitCover();
    window.addEventListener("resize",fitCover);
    return()=>window.removeEventListener("resize",fitCover);
  },[phase,active,fitCover]);

  const fitLabels=useCallback(()=>{
    TRACKS.forEach(tr=>{
      const wrap=labelWrapRefs.current[tr.id],span=labelTextRefs.current[tr.id];
      if(!wrap||!span)return;
      const cw=wrap.clientWidth,ch=wrap.clientHeight;
      if(!cw||!ch)return;
      span.style.transform="none";
      const natW=span.scrollWidth,natH=span.scrollHeight;
      if(!natW||!natH)return;
      span.style.transform=`scale(${cw/natW},${ch/natH})`;
    });
  },[]);

  useLayoutEffect(()=>{
    if(tool!=="text")return;
    fitLabels();
    window.addEventListener("resize",fitLabels);
    return()=>window.removeEventListener("resize",fitLabels);
  },[tool,morph,hidden,fitLabels]);

  useEffect(()=>{const h=e=>{const k=e.key.toUpperCase();const f=TOOLS.find(t=>t.key===k);if(f){setTool(p=>p===f.id?"rect":f.id);e.preventDefault();}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
  useEffect(()=>{
    if(tool==="rect"){setMorph(0);setTriShape(false);}
    if(tool==="ellipse"){setMorph(4);setTriShape(false);}
    if(tool==="triangle")setTriShape(true);
  },[tool]);

  const openTrack = useCallback((e, track) => {
    if (phase) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    wheelLock.current=false;
    wheelAccum.current=0;
    if(wheelTimer.current){clearTimeout(wheelTimer.current);wheelTimer.current=null;}
    setActive(track);
    setOriginRect({left:rect.left,top:rect.top,width:rect.width,height:rect.height});
    setPhase("start");
  },[phase,tool]);

  useEffect(()=>{
    if(phase==="start"){setOnCover(true);const f=requestAnimationFrame(()=>requestAnimationFrame(()=>setPhase("expanding")));return()=>cancelAnimationFrame(f);}
    if(phase==="expanding"){const t=setTimeout(()=>{setPhase("open");setTimeout(()=>setShow(true),80);},650);return()=>clearTimeout(t);}
  },[phase]);

  const close=useCallback(()=>{setShow(false);setTimeout(()=>{setPhase("collapsing");setTimeout(()=>{setPhase(null);setActive(null);setOriginRect(null);},650);},200);},[]);
  const onScroll=useCallback(()=>{const el=scrollRef.current;if(el)setOnCover(el.scrollLeft<el.clientWidth*0.5);},[]);
  const advanceSlide=useCallback(dir=>{
    const el=scrollRef.current;
    if(!el||wheelLock.current)return;
    const slideW=el.clientWidth,maxIndex=Math.round((el.scrollWidth-slideW)/slideW);
    const current=Math.round(el.scrollLeft/slideW);
    if(dir>0&&current>=maxIndex){
      wheelLock.current=true;
      close();
      return;
    }
    const target=Math.min(Math.max(current+dir,0),maxIndex);
    if(target*slideW===Math.round(el.scrollLeft))return;
    wheelLock.current=true;
    el.scrollTo({left:target*slideW,behavior:"smooth"});
    setTimeout(()=>{wheelLock.current=false;},320);
  },[close]);
  const onWheel=useCallback(e=>{
    const el=scrollRef.current;
    if(!el||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    if(wheelLock.current)return;
    wheelAccum.current+=e.deltaY;
    if(wheelTimer.current)return;
    wheelTimer.current=setTimeout(()=>{
      wheelTimer.current=null;
      const delta=wheelAccum.current;
      wheelAccum.current=0;
      if(Math.abs(delta)<15||wheelLock.current)return;
      advanceSlide(delta>0?1:-1);
    },140);
  },[advanceSlide]);
  useEffect(()=>{
    if(phase!=="open")return;
    const h=e=>{
      if(e.code==="Space"){e.preventDefault();advanceSlide(1);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[phase,advanceSlide]);
  const handleContext=useCallback((e,tr)=>{e.preventDefault();setCtx({x:e.clientX,y:e.clientY,track:tr});},[]);
  useEffect(()=>{if(ctx){const h=()=>setCtx(null);window.addEventListener("click",h);return()=>window.removeEventListener("click",h);}},[ctx]);

  const copyCSS=useCallback((tr,i)=>{
    const l=RECT[i],isC=!triShape&&morph===4,c=CIRC[i];
    const clip=triShape?TRIANGLE_CLIP:RADIUS_CLIPS[morph];
    const css=`/* ${tr.label} */\n.block {\n  width: ${isC?c.s:l.w}vw;\n  height: ${isC?c.s+"vw":l.h+"vh"};\n  clip-path: ${clip};\n  background: ${tr.color};\n}`;
    navigator.clipboard?.writeText(css);setCtx(null);
  },[morph,triShape]);

  const ovStyle=(()=>{
    if(!originRect||!active)return{};
    const shapeClip=triShape?TRIANGLE_CLIP:RADIUS_CLIPS[morph];
    const b={position:"fixed",zIndex:200,backgroundColor:active.color,overflow:"hidden"};
    const boxT="left 0.65s cubic-bezier(0.65,0,0.35,1),top 0.65s cubic-bezier(0.65,0,0.35,1),width 0.65s cubic-bezier(0.65,0,0.35,1),height 0.65s cubic-bezier(0.65,0,0.35,1)";
    if(phase==="start")return{...b,...originRect,clipPath:shapeClip,transition:"none"};
    if(phase==="expanding"||phase==="open")return{...b,left:0,top:0,width:"100vw",height:"100vh",clipPath:RADIUS_CLIPS[0],transition:`${boxT},clip-path 0.2s ease-out`};
    if(phase==="collapsing")return{...b,...originRect,clipPath:shapeClip,transition:`${boxT},clip-path 0.2s ease-in 0.45s`};
    return{};
  })();

  const cursor=tool==="rect"||tool==="ellipse"||tool==="triangle"?"crosshair":"default";

  const canvasBg=darkMode?"#161616":"#F5F5F5";
  const surfaceBg=darkMode?"#242424":"#fff";
  const surfaceBorder=darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)";
  const rulerBg=darkMode?"#1e1e1e":"#E8E8E8";
  const rulerBorder=darkMode?"#333":"#D0D0D0";
  const rulerTick=darkMode?"#4a4a4a":"#B0B0B0";
  const rulerLabel=darkMode?"#777":"#888";
  const iconMuted=darkMode?"#777":"#999";
  const iconActive=darkMode?"#eee":"#333";
  const iconSelBg=darkMode?"rgba(255,255,255,0.1)":"#F0F0F0";
  const iconHoverBg=darkMode?"rgba(255,255,255,0.06)":"#F8F8F8";
  const dotGridColor=darkMode?"#333":"#ccc";
  const menuText=darkMode?"#ddd":"#333";
  const menuHoverBg=darkMode?"rgba(255,255,255,0.08)":"#F5F5F5";
  const menuDivider=darkMode?"rgba(255,255,255,0.1)":"#F0F0F0";
  const layerLabel=darkMode?"#aaa":"#555";

  return (
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:canvasBg,position:"relative",
      fontFamily:"Inter,-apple-system,system-ui,sans-serif",cursor,boxSizing:"border-box",transition:"background 0.3s"}} tabIndex={0}>
      <style>{"*,*::before,*::after{box-sizing:border-box}"}</style>

      {/* ── Top Status Bar ── */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:32,display:"flex",alignItems:"center",
        opacity:phase?0:1,transition:"opacity 0.3s",zIndex:30}}>
        <div style={{flex:1,height:"100%",backgroundColor:FB,display:"flex",alignItems:"center",padding:"0 10px",gap:10}}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{marginRight:2,opacity:0.7}}>
            <rect x="1" y="1" width="8" height="8" stroke="#fff" strokeWidth="1.2" rx="0.5"/>
            <line x1="3.5" y1="0" x2="3.5" y2="10" stroke="#fff" strokeWidth="0.8"/>
            <line x1="0" y1="3.5" x2="10" y2="3.5" stroke="#fff" strokeWidth="0.8"/>
          </svg>
          <span style={{fontSize:10.5,fontWeight:500,color:"#fff"}}>QING GU (LESLEY)</span>
          <div style={{flex:1}}/>
          <div style={{width:1,height:14,backgroundColor:"rgba(255,255,255,0.2)"}}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:500,fontVariantNumeric:"tabular-nums"}}>100%</span>
        </div>
        <div style={{height:"100%",backgroundColor:"#24292e",display:"flex",alignItems:"center",padding:"0 12px",gap:6,cursor:"pointer"}}
          onClick={()=>window.open(`https://github.com/${GH_USER}`,"_blank")}>
          <GHIcon size={14} color="#fff"/><span style={{fontSize:10,fontWeight:500,color:"rgba(255,255,255,0.7)",
            fontFamily:"'SF Mono','Fira Code','Consolas',monospace"}}>{GH_USER}</span>
        </div>
      </div>

      {/* ── Left Ruler ── */}
      {!phase&&(
        <div style={{position:"absolute",top:32,left:0,bottom:0,width:20,backgroundColor:rulerBg,
          borderRight:`1px solid ${rulerBorder}`,zIndex:25,overflow:"hidden"}}>
          {Array.from({length:60},(_,i)=>(
            <div key={i} style={{position:"absolute",top:i*20,left:i%5===0?4:10,width:i%5===0?16:10,height:1,backgroundColor:rulerTick}}>
              {i%5===0&&<span style={{position:"absolute",left:-2,top:3,fontSize:8,color:rulerLabel,
                transform:"rotate(-90deg)",transformOrigin:"0 0",whiteSpace:"nowrap"}}>{i*20}</span>}
            </div>
          ))}
          {hovered&&(()=>{
            const idx=TRACKS.findIndex(t=>t.id===hovered),l=morph===4?CIRC[idx]:RECT[idx];
            return <div style={{position:"absolute",left:0,top:`${l.y}vh`,height:1,width:20,backgroundColor:FB,zIndex:2}}/>;
          })()}
        </div>
      )}

      {/* ── Dot grid ── */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:`radial-gradient(${dotGridColor} 0.7px,transparent 0.7px)`,backgroundSize:"20px 20px",
        opacity:phase==="open"?0:0.4,transition:"opacity 0.4s"}}/>

      {/* ── Rainbow Layers ── */}
      {!phase&&(
        <div style={{position:"absolute",top:44,left:24,zIndex:28}}>
          <div onClick={()=>setLayersOpen(!layersOpen)}
            onMouseEnter={()=>setLayersHint(true)} onMouseLeave={()=>setLayersHint(false)}
            style={{position:"relative",width:36,height:36,borderRadius:10,backgroundColor:surfaceBg,
              boxShadow:`0 2px 8px rgba(0,0,0,0.08),0 0 0 1px ${surfaceBorder}`,
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
              fontSize:18,userSelect:"none",transition:"transform 0.15s,background 0.3s",
              transform:layersOpen?"rotate(15deg)":"rotate(0)"}}>🌈
            {layersHint&&!layersOpen&&(
              <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,
                background:"#000",color:"#fff",fontSize:9,fontWeight:600,padding:"3px 7px",borderRadius:3,
                whiteSpace:"nowrap",pointerEvents:"none"}}>LAYERS</div>
            )}
          </div>
          {layersOpen&&(
            <div style={{marginTop:6,width:190,backgroundColor:surfaceBg,borderRadius:10,
              boxShadow:`0 4px 16px rgba(0,0,0,0.1),0 0 0 1px ${surfaceBorder}`,padding:"4px 0"}}>
              {TRACKS.map(tr=>(
                <div key={tr.id}
                  onMouseEnter={()=>setHovered(tr.id)} onMouseLeave={()=>setHovered(null)}
                  onClick={()=>{if(!hidden[tr.id]){setLayersOpen(false);const el=document.querySelector(`[data-track="${tr.id}"]`);
                    if(el){const r=el.getBoundingClientRect();setActive(tr);setOriginRect({left:r.left,top:r.top,width:r.width,height:r.height});setPhase("start");}}}}
                  style={{padding:"7px 12px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                    backgroundColor:hovered===tr.id?menuHoverBg:"transparent",transition:"background 0.15s",
                    opacity:hidden[tr.id]?0.35:1}}>
                  <div style={{width:10,height:10,borderRadius:3,backgroundColor:tr.color,flexShrink:0}}/>
                  <span style={{fontSize:10,color:layerLabel,fontWeight:500,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tr.label}</span>
                  <div onClick={e=>{e.stopPropagation();setHidden(h=>({...h,[tr.id]:!h[tr.id]}));}} style={{padding:2,cursor:"pointer"}}>
                    {hidden[tr.id]?<EyeOff size={11} color={iconMuted}/>:<Eye size={11} color={iconMuted}/>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Welcome cursor ── */}
      {!phase&&<WelcomeCursor/>}

      {/* ── Color blocks ── */}
      {TRACKS.map((tr,i)=>{
        const l=RECT[i],c=CIRC[i],isH=hovered===tr.id,isC=!triShape&&morph===4;
        const shapeClip=triShape?TRIANGLE_CLIP:RADIUS_CLIPS[morph];
        const bx=isC?c.x:l.x,by=isC?c.y:l.y,bw=isC?c.s:l.w,bh=isC?c.s:l.h;
        const pxW=Math.round(bw*14.4),pxH=Math.round(bh*(isC?14.4:7.2));
        const hasAi=tr.projects?.some(p=>p.ai);
        const dimmed=aiOnly&&!hasAi;
        if(hidden[tr.id])return null;
        return(
          <div key={tr.id} data-track={tr.id}
            onMouseEnter={()=>!phase&&setHovered(tr.id)} onMouseLeave={()=>setHovered(null)}
            onClick={e=>openTrack(e,tr)} onContextMenu={e=>handleContext(e,tr)}
            style={{position:"absolute",left:`${bx}vw`,top:`${by}vh`,
              width:isC?`${bw}vw`:`calc(${bw}vw + 1px)`,
              height:isC?`${bh}vw`:`calc(${bh}vh + 1px)`,
              cursor:phase?"default":"pointer",
              transition:"all 0.65s cubic-bezier(0.34,1.56,0.64,1),transform 0.15s ease,box-shadow 0.15s ease,opacity 0.3s ease",
              transform:isH?"scale(1.015)":"scale(1)",boxShadow:isH?`0 0 0 1.5px ${FB}`:"none",
              zIndex:isH?10:i+1,opacity:phase&&phase!=="start"&&phase!=="collapsing"?0.2:dimmed?0.25:1}}>
            <div style={{position:"absolute",inset:0,backgroundColor:tr.color,clipPath:shapeClip,
              transition:"clip-path 0.65s cubic-bezier(0.34,1.56,0.64,1)"}}/>
            {tool==="text"&&(
              <div ref={el=>labelWrapRefs.current[tr.id]=el}
                style={{position:"absolute",inset:"3%",display:"flex",alignItems:"center",
                  justifyContent:"center",overflow:"hidden",pointerEvents:"none"}}>
                <span ref={el=>labelTextRefs.current[tr.id]=el}
                  style={{fontSize:100,fontWeight:800,color:"#fff",whiteSpace:"nowrap",
                  fontFamily:"Inter,-apple-system,system-ui,sans-serif",lineHeight:1,
                  letterSpacing:"-0.01em",transformOrigin:"center"}}>{tr.short||tr.label}</span>
              </div>
            )}
            {isH&&!phase&&<>
              <div style={{position:"absolute",top:-20,left:-1,background:FB,color:"#fff",
                fontSize:9,fontWeight:500,padding:"1.5px 5px",borderRadius:2,whiteSpace:"nowrap",
                pointerEvents:"none",lineHeight:"14px"}}>{tr.label}</div>
              <Handle style={{top:-3,left:-3}}/><Handle style={{top:-3,right:-3}}/>
              <Handle style={{bottom:-3,left:-3}}/><Handle style={{bottom:-3,right:-3}}/>
              <Handle style={{top:-3,left:"calc(50% - 3px)"}}/><Handle style={{bottom:-3,left:"calc(50% - 3px)"}}/>
              <Handle style={{top:"calc(50% - 3px)",left:-3}}/><Handle style={{top:"calc(50% - 3px)",right:-3}}/>
              {/* Dimension labels */}
              <div style={{position:"absolute",top:"calc(50% - 8px)",left:-42,fontSize:8,color:FB,fontWeight:600,
                pointerEvents:"none",transform:"rotate(-90deg)",whiteSpace:"nowrap",fontVariantNumeric:"tabular-nums"}}>{pxH}px</div>
              <div style={{position:"absolute",bottom:-18,left:"50%",transform:"translateX(-50%)",
                fontSize:8,color:FB,fontWeight:600,pointerEvents:"none",fontVariantNumeric:"tabular-nums"}}>{pxW}px</div>
            </>}
          </div>
        );
      })}

      {/* ── Right-click menu ── */}
      {ctx&&(()=>{
        const idx=TRACKS.findIndex(t=>t.id===ctx.track.id);
        const items=[
          {label:"Open track",action:()=>{setCtx(null);const el=document.querySelector(`[data-track="${ctx.track.id}"]`);
            if(el){const r=el.getBoundingClientRect();setActive(ctx.track);setOriginRect({left:r.left,top:r.top,width:r.width,height:r.height});setPhase("start");}}},
          {label:"Copy as CSS",action:()=>copyCSS(ctx.track,idx),mono:true},
          ctx.track.projects?.find(p=>p.gh)&&{label:"View on GitHub",action:()=>{window.open(`https://github.com/${GH_USER}`,"_blank");setCtx(null);}},
          {sep:true},
          {label:"Morph to Rectangle",action:()=>{setMorph(0);setTool("rect");setCtx(null);}},
          {label:"Morph to Circle",action:()=>{setMorph(4);setTool("ellipse");setCtx(null);}},
          {sep:true},
          {label:hidden[ctx.track.id]?"Show layer":"Hide layer",action:()=>{setHidden(h=>({...h,[ctx.track.id]:!h[ctx.track.id]}));setCtx(null);}},
        ].filter(Boolean);
        return(
          <div style={{position:"fixed",left:ctx.x,top:ctx.y,zIndex:500,backgroundColor:surfaceBg,borderRadius:8,
            padding:"4px 0",boxShadow:`0 4px 20px rgba(0,0,0,0.15),0 0 0 1px ${surfaceBorder}`,minWidth:180}}
            onClick={e=>e.stopPropagation()}>
            {items.map((it,ii)=>it.sep
              ?<div key={ii} style={{height:1,backgroundColor:menuDivider,margin:"4px 0"}}/>
              :<div key={ii} onClick={it.action}
                style={{padding:"7px 14px",fontSize:11,color:menuText,
                  fontFamily:it.mono?"'SF Mono','Fira Code',monospace":"inherit",
                  fontWeight:500,cursor:"pointer",transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.backgroundColor=menuHoverBg}
                onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                {it.label}</div>
            )}
          </div>
        );
      })()}

      {/* ── Floating Toolbar — BOTTOM ── */}
      {!phase&&(
        <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",zIndex:28,
          display:"flex",alignItems:"center",gap:2,padding:"6px 8px",
          backgroundColor:surfaceBg,borderRadius:12,boxShadow:`0 2px 12px rgba(0,0,0,0.1),0 0 0 1px ${surfaceBorder}`,
          transition:"background 0.3s"}}>
          <div onClick={()=>setAiOnly(v=>!v)}
            onMouseEnter={()=>setAiHint(true)} onMouseLeave={()=>setAiHint(false)}
            style={{position:"relative",width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",
              justifyContent:"center",backgroundColor:aiOnly?iconSelBg:"transparent",cursor:"pointer",transition:"background 0.15s"}}>
            <Bot size={17} color={aiOnly?FB:iconMuted} strokeWidth={aiOnly?2:1.5}/>
            {aiHint&&(
              <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
                background:"#000",color:"#fff",fontSize:9,fontWeight:600,padding:"3px 7px",borderRadius:3,
                whiteSpace:"nowrap",pointerEvents:"none"}}>AI PROJECTS ONLY</div>
            )}
          </div>
          <div style={{width:1,height:22,backgroundColor:rulerBorder,margin:"0 4px"}}/>
          {TOOLS.map(t=>{
            const Icon=t.icon,sel=tool===t.id;
            return(
              <div key={t.id} onClick={()=>setTool(sel?"rect":t.id)} title={t.key}
                style={{width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
                  backgroundColor:sel?iconSelBg:"transparent",cursor:"pointer",transition:"background 0.15s"}}
                onMouseEnter={e=>!sel&&(e.currentTarget.style.backgroundColor=iconHoverBg)}
                onMouseLeave={e=>!sel&&(e.currentTarget.style.backgroundColor="transparent")}>
                <Icon size={17} color={sel?iconActive:iconMuted} strokeWidth={sel?2:1.5}/>
              </div>
            );
          })}
          <div style={{width:1,height:22,backgroundColor:rulerBorder,margin:"0 4px"}}/>
          <div onClick={()=>setDarkMode(v=>!v)}
            onMouseEnter={()=>setDarkHint(true)} onMouseLeave={()=>setDarkHint(false)}
            style={{position:"relative",width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",
              justifyContent:"center",cursor:"pointer",transition:"background 0.15s"}}
            onMouseOver={e=>e.currentTarget.style.backgroundColor=iconHoverBg}
            onMouseOut={e=>e.currentTarget.style.backgroundColor="transparent"}>
            {darkMode?<Moon size={17} color={iconActive}/>:<Sun size={17} color={iconMuted}/>}
            {darkHint&&(
              <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
                background:"#000",color:"#fff",fontSize:9,fontWeight:600,padding:"3px 7px",borderRadius:3,
                whiteSpace:"nowrap",pointerEvents:"none"}}>{darkMode?"LIGHT MODE":"DARK MODE"}</div>
            )}
          </div>
        </div>
      )}

      {/* ═══ DETAIL VIEW ═══ */}
      {phase&&active&&(
        <div style={ovStyle}>
          {(phase==="open"||phase==="collapsing")&&<>
            <button onClick={close} style={{position:"fixed",top:24,right:24,zIndex:310,
              background:"none",border:"none",cursor:"pointer",padding:8,
              opacity:show?1:0,transition:"opacity 0.3s"}}>
              <X size={40} strokeWidth={2.5} color={isDark(active.color)?"#000":"#fff"}/>
            </button>
            <div style={{position:"fixed",top:28,left:28,zIndex:310,fontSize:10,fontWeight:600,
              letterSpacing:"0.1em",color:isDark(active.color)?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.4)",
              opacity:show&&!onCover?1:0,transition:"opacity 0.3s"}}>{active.label}</div>

            <style>{"\n              .hscroll::-webkit-scrollbar{display:none}\n            "}</style>
            <div ref={scrollRef} onScroll={onScroll} onWheel={onWheel} className="hscroll" style={{
              display:"flex",width:"100vw",height:"100vh",overflowX:"auto",overflowY:"hidden",
              scrollbarWidth:"none",msOverflowStyle:"none",
              scrollSnapType:"x mandatory",opacity:show?1:0,transition:"opacity 0.4s"}}>
              <section style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:active.color,
                scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                padding:"0 4vw",position:"relative",flexShrink:0,overflow:"hidden"}}>
                <h1 ref={coverRef} style={{fontSize:"clamp(60px,16vw,240px)",fontWeight:900,
                  color:isDark(active.color)?"#000":"#fff",letterSpacing:"-0.04em",lineHeight:0.9,
                  margin:0,textAlign:"center",whiteSpace:"nowrap"}}>{active.label}</h1>
                <div style={{position:"absolute",right:36,bottom:36,
                  display:"flex",alignItems:"center",gap:6,fontSize:10,fontWeight:600,letterSpacing:"0.1em",
                  color:isDark(active.color)?"rgba(0,0,0,0.35)":"rgba(255,255,255,0.4)"}}>
                  <span>SCROLL</span><ArrowRight size={16}/>
                </div>
              </section>
              {active.isAbout?[
                <section key="about1" style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:"#000",
                  scrollSnapAlign:"start",flexShrink:0,overflow:"hidden"}}>
                  <img src="/about/about1.png" alt="Title screen" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </section>,
                <section key="about2" style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:"#000",
                  scrollSnapAlign:"start",flexShrink:0,overflow:"hidden"}}>
                  <img src="/about/about2.png" alt="Bio dialogue" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </section>,
                <section key="bio" style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:active.color,
                  scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                  padding:"0 6vw",flexShrink:0,overflow:"hidden"}}>
                  <div style={{display:"flex",gap:"4vw",alignItems:"center",justifyContent:"space-between",
                    width:"100%",maxWidth:1500,flexWrap:"wrap"}}>
                    <img src="/images/zju2.jpg" alt="Graduation" loading="lazy" style={{height:"50vh",width:"auto",
                      maxWidth:"100%",objectFit:"contain"}}/>
                    <div style={{maxWidth:460,flex:"1 1 380px"}}>
                      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                        {["#UX Engineer","#Creative Technologist"].map(tag=>(
                          <span key={tag} style={{fontSize:11,fontWeight:600,color:isDark(active.color)?"#000":"#fff",
                            padding:"4px 10px",borderRadius:20,
                            backgroundColor:isDark(active.color)?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.15)"}}>{tag}</span>
                        ))}
                      </div>
                      <p style={{fontSize:17,lineHeight:1.8,
                        color:isDark(active.color)?"rgba(0,0,0,0.75)":"rgba(255,255,255,0.9)",
                        margin:0,fontWeight:400}}>
                        I engineer AI-forward, accessible systems that resonate across diverse human experiences.
                        I blend a filmmaker's storytelling with a dancer's heightened sensitivity to ensure the
                        future of tech is not just smart, but fundamentally human-centric.
                      </p>
                      <p style={{fontSize:12,fontWeight:500,letterSpacing:"0.02em",marginTop:18,lineHeight:1.6,
                        color:isDark(active.color)?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.55)"}}>
                        2024–2026 · MSc Human-Computer Interaction &amp; Design — KTH &amp; Aalto, Stockholm &amp; Helsinki<br/>
                        2018–2022 · BSc Applied Psychology &amp; Industrial Design — Zhejiang University, Hangzhou
                      </p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {[
                        {t:"Email →",href:"mailto:lesleygujiji@gmail.com"},
                        {t:"GitHub →",href:`https://github.com/${GH_USER}`},
                        {t:"LinkedIn →",href:"https://www.linkedin.com/in/qing-gu-072167322/"},
                        {t:"Instagram →",href:"https://www.instagram.com/lesleygujiji/"},
                        {t:"Letterboxd →",href:"https://letterboxd.com/lesleygujiji/"},
                      ].map((l,i)=><span key={i} onClick={()=>l.href&&window.open(l.href,"_blank")}
                        style={{fontSize:15,color:isDark(active.color)?"#000":"#fff",fontWeight:500,cursor:"pointer",opacity:0.85}}>{l.t}</span>)}
                    </div>
                  </div>
                </section>,
                <section key="interests" style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:active.color,
                  scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                  padding:"5vh 6vw",flexShrink:0,overflow:"hidden"}}>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
                    <img src="/images/voguing.jpg" alt="Voguing" loading="lazy" style={{height:"46vh",width:"auto",
                      maxWidth:"100%",objectFit:"contain"}}/>
                    <h1 style={{width:"100%",fontSize:"clamp(40px,10vw,160px)",fontWeight:900,
                      letterSpacing:"-0.03em",lineHeight:0.9,textAlign:"center",margin:0,
                      color:isDark(active.color)?"#000":"#fff"}}>INTEREST</h1>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                      {["#Film","#Voguing","#Climbing"].map(tag=>(
                        <span key={tag} style={{fontSize:13,fontWeight:600,color:isDark(active.color)?"#000":"#fff",
                          padding:"6px 14px",borderRadius:20,
                          backgroundColor:isDark(active.color)?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.15)"}}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </section>,
              ]:active.projects.flatMap((proj,pi)=>{
                  const bg=proj.bg,dk=isDark(bg),fg=dk?"#000":"#fff",
                    sub=dk?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.7)",
                    dim=aiOnly&&!proj.ai,
                    ghPath=proj.gh&&(proj.gh.includes("/")?proj.gh:`${GH_USER}/${proj.gh}`);
                  const galleryChunks=[];
                  if(proj.carousel){
                    galleryChunks.push(proj.gallery);
                  }else if(proj.gallery){
                    let buf=[];
                    proj.gallery.forEach(g=>{
                      if(g.solo){
                        if(buf.length){galleryChunks.push(buf);buf=[];}
                        galleryChunks.push([g]);
                      }else{
                        buf.push(g);
                        if(buf.length===2){galleryChunks.push(buf);buf=[];}
                      }
                    });
                    if(buf.length)galleryChunks.push(buf);
                  }
                  return proj.gallery?[
                    <section key={`h${pi}`} style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:bg,
                      scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                      padding:"0 6vw",position:"relative",flexShrink:0,overflow:"hidden",
                      opacity:dim?0.25:1,transition:"opacity 0.3s ease"}}>
                      <div style={{position:"absolute",top:28,right:80,zIndex:5,display:"flex",alignItems:"center",gap:8}}>
                        {proj.ai&&(
                          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:20,
                            backgroundColor:dk?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.15)"}}>
                            <Bot size={12} color={fg}/><span style={{fontSize:10,fontWeight:700,color:fg,letterSpacing:"0.05em"}}>AI</span>
                          </div>
                        )}
                        {proj.gh&&(
                          <div onClick={()=>window.open(`https://github.com/${ghPath}`,"_blank")}
                            style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 10px",borderRadius:6,
                              backgroundColor:dk?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.1)"}}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor=dk?"rgba(0,0,0,0.12)":"rgba(255,255,255,0.2)"}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor=dk?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.1)"}>
                            <GHIcon size={13} color={fg}/><span style={{fontSize:11,fontWeight:500,color:fg,opacity:0.6,
                              fontFamily:"'SF Mono','Fira Code','Consolas',monospace"}}>{ghPath}</span>
                          </div>
                        )}
                      </div>
                      <div style={{width:"100%",maxWidth:1300,display:"flex",gap:"5vw",alignItems:"center",flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 36%",minWidth:280}}>
                          <h1 style={{fontSize:"clamp(36px,4.2vw,64px)",fontWeight:900,color:fg,
                            letterSpacing:"-0.03em",lineHeight:0.95,margin:"0 0 18px 0",whiteSpace:"pre-line"}}>{proj.name}</h1>
                          <p style={{fontSize:15,lineHeight:1.7,color:sub,fontWeight:400,margin:"0 0 16px 0"}}>
                            {proj.why||proj.desc}</p>
                          {proj.stack&&(
                            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                              {proj.stack.map(s=>(
                                <span key={s} style={{fontSize:11,fontWeight:600,color:fg,padding:"4px 10px",
                                  borderRadius:20,backgroundColor:dk?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.15)"}}>{s}</span>
                              ))}
                            </div>
                          )}
                          {proj.live&&(
                            <span onClick={()=>window.open(proj.live,"_blank")}
                              style={{fontSize:13,fontWeight:600,color:fg,cursor:"pointer",opacity:0.85}}>Visit Site ↗</span>
                          )}
                        </div>
                        {proj.image&&(/\.(mp4|webm|mov)$/i.test(proj.image)?(
                          <video src={proj.image} autoPlay loop muted playsInline style={{flex:"1 1 55%",minWidth:0,
                            maxWidth:"100%",maxHeight:"75vh"}}/>
                        ):(
                          <img src={proj.image} alt={proj.name} loading="lazy" style={{flex:"1 1 55%",minWidth:0,
                            maxWidth:"100%",maxHeight:proj.imageScale?`${75*proj.imageScale}vh`:"75vh",
                            width:proj.imageScale?`${100*proj.imageScale}%`:undefined,
                            margin:proj.imageScale?"0 auto":undefined,objectFit:"contain"}}/>
                        ))}
                      </div>
                      <div style={{position:"absolute",bottom:28,left:"4vw",fontSize:12,fontWeight:600,
                        color:sub,letterSpacing:"0.08em",fontVariantNumeric:"tabular-nums"}}>
                        {String(pi+1).padStart(2,"0")} / {String(active.projects.length).padStart(2,"0")}</div>
                    </section>,
                    ...galleryChunks.map((chunk,ci)=>{
                      const solo=chunk.length===1;
                      return(
                        <section key={`g${pi}-${ci}`} style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:bg,
                          scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                          padding:"5vh 6vw",flexShrink:0,overflow:"hidden",
                          opacity:dim?0.25:1,transition:"opacity 0.3s ease"}}>
                          <div style={{width:"100%",maxWidth:1300,display:"flex",
                            flexWrap:"wrap",justifyContent:"center",alignItems:"flex-start",gap:"4vw"}}>
                            {proj.carousel?(
                              <GalleryCarousel items={chunk} fg={fg} sub={sub}/>
                            ):chunk.map(g=>{
                              if(g.type==="group"){
                                const n=g.images.length,
                                  gh=n>=4?"18vh":n===3?"22vh":n===2?"32vh":"52vh",
                                  gmw=`${Math.floor(88/n)}vw`;
                                return(
                                  <div key={g.title} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,width:"100%"}}>
                                    <h3 style={{fontSize:"clamp(20px,2vw,30px)",fontWeight:800,color:fg,margin:0}}>{g.title}</h3>
                                    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"flex-start",gap:"1.5vw",width:"100%"}}>
                                      {g.images.map(src=>(
                                        <img key={src} src={src} alt={g.title} loading="lazy" style={{height:gh,width:"auto",maxWidth:gmw}}/>
                                      ))}
                                    </div>
                                    <p style={{fontSize:14,lineHeight:1.7,color:sub,maxWidth:760,textAlign:"center",margin:0}}>{g.desc}</p>
                                  </div>
                                );
                              }
                              if(g.layout==="side"){
                                return(
                                  <div key={g.title} style={{width:"100%",maxWidth:1300,display:"flex",
                                    gap:"4vw",alignItems:"center",flexWrap:"wrap"}}>
                                    {g.type==="video"?(
                                      <video src={g.src} poster={g.poster} autoPlay loop muted playsInline
                                        style={{flex:"1 1 50%",minWidth:280,maxWidth:"100%",maxHeight:"65vh"}}/>
                                    ):(
                                      <img src={g.src} alt={g.title} loading="lazy" style={{flex:"1 1 50%",minWidth:280,
                                        maxWidth:"100%",maxHeight:"65vh",objectFit:"contain"}}/>
                                    )}
                                    <div style={{flex:"1 1 40%",minWidth:280}}>
                                      <h3 style={{fontSize:"clamp(22px,2.4vw,34px)",fontWeight:800,color:fg,margin:"0 0 16px 0"}}>{g.title}</h3>
                                      <p style={{fontSize:15,lineHeight:1.7,color:sub,margin:0}}>{g.desc}</p>
                                    </div>
                                  </div>
                                );
                              }
                              const h=g.h?`${g.h}vh`:(solo?"72vh":"36vh"),
                                pairMaxW=chunk.length>1?"44vw":"92vw";
                              return(
                              <div key={g.title} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
                                {g.type==="embed"?(
                                  <LazyIframe src={g.src} title={g.title} style={{width:"84vw",height:"78vh",maxWidth:"100%",border:"none"}}/>
                                ):g.type==="youtube"?(
                                  <LazyIframe src={g.src} title={g.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen
                                    style={{height:h,width:"auto",aspectRatio:"16/9",maxWidth:pairMaxW,border:"none"}}/>
                                ):g.type==="video"?(
                                  solo?(
                                    <video src={g.src} poster={g.poster} autoPlay loop muted playsInline
                                      style={{maxHeight:h,maxWidth:"100%"}}/>
                                  ):(
                                    <video src={g.src} poster={g.poster} autoPlay loop muted playsInline
                                      style={{height:h,width:"auto",maxWidth:pairMaxW,objectFit:"contain"}}/>
                                  )
                                ):(
                                  solo?(
                                    <img src={g.src} alt={g.title} loading="lazy" style={{maxHeight:h,maxWidth:"100%"}}/>
                                  ):(
                                    <img src={g.src} alt={g.title} loading="lazy" style={{height:h,width:"auto",
                                      maxWidth:pairMaxW,objectFit:"contain"}}/>
                                  )
                                )}
                                <h3 style={{fontSize:solo?"clamp(20px,2vw,30px)":"clamp(16px,1.6vw,24px)",fontWeight:800,color:fg,margin:0}}>{g.title}</h3>
                                <p style={{fontSize:solo?14:13,lineHeight:1.6,color:sub,maxWidth:solo?560:420,textAlign:"center",margin:0}}>{g.desc}</p>
                              </div>
                              );
                            })}
                          </div>
                        </section>
                      );
                    }),
                  ]:[
                    <section key={`t${pi}`} style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:bg,
                      scrollSnapAlign:"start",display:"flex",alignItems:"center",
                      padding:"0 4vw",position:"relative",flexShrink:0,overflow:"hidden",
                      opacity:dim?0.25:1,transition:"opacity 0.3s ease"}}>
                      <div style={{position:"absolute",top:28,right:80,zIndex:5,display:"flex",alignItems:"center",gap:8}}>
                        {proj.ai&&(
                          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:20,
                            backgroundColor:dk?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.15)"}}>
                            <Bot size={12} color={fg}/><span style={{fontSize:10,fontWeight:700,color:fg,letterSpacing:"0.05em"}}>AI</span>
                          </div>
                        )}
                        {proj.gh&&(
                          <div onClick={()=>window.open(`https://github.com/${ghPath}`,"_blank")}
                            style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 10px",borderRadius:6,
                              backgroundColor:dk?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.1)"}}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor=dk?"rgba(0,0,0,0.12)":"rgba(255,255,255,0.2)"}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor=dk?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.1)"}>
                            <GHIcon size={13} color={fg}/><span style={{fontSize:11,fontWeight:500,color:fg,opacity:0.6,
                              fontFamily:"'SF Mono','Fira Code','Consolas',monospace"}}>{ghPath}</span>
                          </div>
                        )}
                      </div>
                      <h1 style={{fontSize:"clamp(50px,9vw,160px)",fontWeight:900,color:fg,
                        letterSpacing:"-0.05em",lineHeight:0.82,margin:0,whiteSpace:"pre-line"}}>{proj.name}</h1>
                      <div style={{position:"absolute",bottom:28,left:"4vw",fontSize:12,fontWeight:600,
                        color:sub,letterSpacing:"0.08em",fontVariantNumeric:"tabular-nums"}}>
                        {String(pi+1).padStart(2,"0")} / {String(active.projects.length).padStart(2,"0")}</div>
                      <p style={{position:"absolute",bottom:28,right:80,fontSize:"clamp(11px,1.1vw,16px)",
                        color:sub,fontWeight:500,maxWidth:300,textAlign:"right"}}>{proj.desc}</p>
                    </section>,
                    <section key={`c${pi}`} style={{width:"100vw",minWidth:"100vw",height:"100vh",backgroundColor:bg,
                      scrollSnapAlign:"start",display:"flex",alignItems:"center",justifyContent:"center",
                      padding:"6vh 6vw",flexShrink:0,overflow:"hidden",opacity:dim?0.25:1,transition:"opacity 0.3s ease"}}>
                      <div style={{width:"100%",maxWidth:1100,display:"flex",gap:"4vw",alignItems:"center",flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 55%",minWidth:280,aspectRatio:"16/10",
                          backgroundColor:dk?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.1)",borderRadius:12,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:12,color:sub,fontWeight:500,letterSpacing:"0.08em",
                          border:`1.5px dashed ${dk?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.15)"}`}}>PROJECT IMAGE</div>
                        <div style={{flex:"1 1 30%",minWidth:220}}>
                          <h2 style={{fontSize:"clamp(24px,3vw,44px)",fontWeight:800,color:fg,
                            letterSpacing:"-0.02em",lineHeight:1.1,margin:"0 0 16px 0"}}>{proj.name.replace(/\n/g," ")}</h2>
                          <p style={{fontSize:14,lineHeight:1.7,color:sub,fontWeight:400,margin:0}}>
                            Challenge and outcome description placeholder. Replace with project brief, key decisions, and results.</p>
                        </div>
                      </div>
                    </section>,
                  ];
                })}
              </div>
          </>}
        </div>
      )}
    </div>
  );
}
