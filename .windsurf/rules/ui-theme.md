---
trigger: always_on
---

# UI Theme

Design System Prompt (Themes, Colors, Animations)

1. Color Themes:

   - Support both Dark Mode and Light Mode (toggle button top-right)
   - Light Mode: #fdfdfd background, #1f1f1f text, blue/violet accent (#6366F1, #7C3AED)
   - Dark Mode: #0e0e10 background, #fafafa text, neon/cyber blue accent (#38BDF8, #3B82F6)
   - Smooth transitions between themes using Tailwind's dark mode classes

2. Fonts:

   - Headings: 'Space Grotesk', sans-serif (bold, modern)
   - Body: 'Inter', sans-serif (clean, readable)

3. UI Elements:

   - Hero section with a floating avatar + typing animation for title
   - Glassmorphic project cards (on hover: subtle tilt and glow)
   - Sticky navbar with scroll section highlight
   - Animated skill icons (scroll-in fade + hover scale)
   - Timeline section for experience using vertical stepper
   - Parallax scroll effect on project thumbnails
   - Button styles: pill-shaped with gradient background, hover ripple effect

4. Animations:

   - Framer Motion page transitions (fade/slide)
   - Hero text typing effect: "AI Engineer", "Full Stack Developer", "Automation Architect"
   - Scroll-based section reveals (fade-in, slide-up)
   - SVG wave transitions between sections
   - Particle background in hero (optional)

5. Responsiveness:
   - Mobile-first layout
   - Collapsible menu for mobile
   - Project carousel/swiper on smaller screens

Landing Page UI Structure (Section-wise Layout)

1. Navbar (sticky top)

   - Logo (Arka Lal)
   - Links: Home, About, Projects, Resume, Experience, Contact
   - Theme toggle (light/dark)
   - CTA: "Hire Me" (button scrolls to Contact)

2. Hero Section

   - Big heading with typing effect
   - Short subtitle: "Building powerful AI & SaaS experiences"
   - Call-to-action buttons: View Resume, Contact Me
   - Animated avatar or vector illustration (looping Lottie or floating effect)
   - Background: particle or radial gradient

3. About Me

   - Bio with photo
   - Timeline of education and early journey
   - Icons of companies worked with

4. Skills & Tech Stack

   - Categorized grid (Frontend, Backend, AI, Tools)
   - Hover effects to show expertise level or years of experience

5. Projects Section

   - Grid or horizontal carousel
   - Each card: project title, short description, stack used, GitHub & demo links
   - Hover animations, tag badges (e.g., #NextJS, #GPT-4)

6. Experience Timeline

   - Vertical scroll timeline with logos, roles, and descriptions
   - Optionally animate as scrolls into view

7. Resume

   - Interactive layout of your resume with download PDF button
   - Optionally render from markdown or JSON for dynamic updates

8. Testimonials (Optional)

   - Carousel of client/founder testimonials
   - Image, name, role, and feedback

9. Contact Section

   - Email form (with validation)
   - Social links (LinkedIn, GitHub, Twitter)
   - Calendly/booking button (optional)

10. Footer

- Copyright
- Mini site nav + social links
