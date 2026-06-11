export interface TemplateItem {
  id: string;
  name: string;
  desc: string;
  domain: string;
  sections: Array<{
    type: string;
    variant: string;
    props: Record<string, any>;
    style?: Record<string, any>;
  }>;
}

export const READY_TEMPLATES: TemplateItem[] = [
  {
    id: "saas",
    name: "SaaS Startup",
    desc: "Premium layout for SaaS apps with dashboard mockup, core features grid, benefits row, and pricing tiers.",
    domain: "SaaS / Tech",
    sections: [
      {
        type: "hero",
        variant: "modern",
        props: {
          title: "Supercharge Your Team's Productivity",
          subtitle: "Streamline workflows, automate tedious tasks, and gain real-time visibility with ApexFlow's collaborative cloud OS.",
          ctaText: "Start Free Trial",
          ctaLink: "#pricing",
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Built for Fast-Moving Teams",
          subtitle: "Everything you need to orchestrate projects, manage data, and accelerate output.",
          items: [
            { title: "Real-time Sync Node", desc: "Sync pipeline files instantly and securely across multiple servers.", icon: "zap" },
            { title: "Military-grade Security", desc: "Advanced compliance protocols and data encryption standards built into the core.", icon: "shield" },
            { title: "Custom Analytics Grids", desc: "Optimize metrics monitoring with tailor-made drag-and-drop dashboards.", icon: "sliders" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "Eliminate Operational Bottlenecks",
          subtitle: "Why scaling startups choose our edge-caching execution network.",
          items: [
            { title: "Save 15+ Hours Weekly", desc: "Let automated nodes manage your routine synchronization processes so you can focus on core product growth.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
            { title: "Unlimited Horizontal Scale", desc: "Distributed content delivery nodes designed to sustain heavy loads with low latency.", image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "pricing",
        variant: "modern",
        props: {
          title: "Transparent, Scale-Friendly Plans",
          subtitle: "Choose the subscription tier that matches your company's operational scale.",
          tiers: [
            { name: "Starter", price: "$29", period: "month", features: ["1 Page layout", "Standard API sync", "Email support"], popular: false },
            { name: "Growth Suite", price: "$79", period: "month", features: ["Unlimited pages", "Priority API endpoints", "Dedicated database space", "SLA uptime guarantee"], popular: true },
            { name: "Enterprise OS", price: "$199", period: "month", features: ["Custom contract SLA", "Unlimited logs bandwidth", "Dedicated account manager", "SSO/SAML client sync"], popular: false }
          ]
        }
      },
      {
        type: "faq",
        variant: "modern",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Fast answers to common inquiries regarding ApexFlow.",
          items: [
            { q: "Is there a free trial period?", a: "Yes, you can try our Growth Suite free for 14 days without inputting any credit card details." },
            { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel, upgrade, or downgrade your plan directly from your account dashboard with one click." }
          ]
        }
      }
    ]
  },
  {
    id: "ai",
    name: "AI Platform",
    desc: "Futuristic dark template optimized for AI agents, model sandboxes, and API developer platforms.",
    domain: "SaaS / Tech",
    sections: [
      {
        type: "hero",
        variant: "futuristic",
        props: {
          title: "Cognitive Intelligence on the Edge",
          subtitle: "Deploy custom AI agents, fine-tune neural model weights, and compute inferences in milliseconds via our serverless API grids.",
          ctaText: "Get Developer API Key",
          ctaLink: "#features",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "futuristic",
        props: {
          title: "Engineered for Cognitive Inference",
          subtitle: "A unified software layer built to optimize machine learning performance.",
          items: [
            { title: "Autonomous Agents", desc: "Initialize goal-seeking workflows that interact with external tools and APIs.", icon: "cpu" },
            { title: "Continuous Weights Sync", desc: "Synchronize model variables across edge server pools in real-time.", icon: "refresh-cw" },
            { title: "Low Latency Gateway", desc: "Average response speeds of less than 24ms for complex model prompt runs.", icon: "zap" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "Supercharge Your Applications",
          subtitle: "Integrate LLM capabilities without managing hardware orchestration.",
          items: [
            { title: "No GPU Setup Required", desc: "We manage server clusters, scaling, and load-balancing behind a single REST endpoint.", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop" },
            { title: "Cost-Effective Inferences", desc: "Pay only for the exact token bandwidth you consume during API execution.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "pricing",
        variant: "modern",
        props: {
          title: "Inference-Based Pricing",
          subtitle: "Predictable plans designed for developers and enterprise scale.",
          tiers: [
            { name: "Hobbyist", price: "$0", period: "month", features: ["1,000 monthly tokens", "Access to base models", "Standard community Discord support"], popular: false },
            { name: "Pro API", price: "$49", period: "month", features: ["10 Million monthly tokens", "Access to fine-tuned weights", "Priority support gateway", "No rate limits"], popular: true },
            { name: "Enterprise", price: "$299", period: "month", features: ["Custom token volume packages", "Dedicated private nodes", "Custom model fine-tuning support", "Uptime SLA contract"], popular: false }
          ]
        }
      }
    ]
  },
  {
    id: "agency",
    name: "Agency Showcase",
    desc: "A bold, high-contrast, minimalist portfolio for web design, marketing, and development agencies.",
    domain: "Creative / Business",
    sections: [
      {
        type: "hero",
        variant: "minimal",
        props: {
          title: "We Architect Premium Digital Identities",
          subtitle: "A digital agency crafting HSL visual design systems, custom Next.js architectures, and edge deployment infrastructures for modern brands.",
          ctaText: "Work With Us",
          ctaLink: "#contact"
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Our Specialized Services",
          subtitle: "Full-service digital campaigns driven by measurable KPIs.",
          items: [
            { title: "Bespoke Consulting", desc: "Strategic audits mapping brand presence, layout bottlenecks, and conversion optimization avenues.", price: "$999" },
            { title: "Production Deployment", desc: "Next.js applications compiled with HSL color palettes and deployed to global edge networks.", price: "$2,499" },
            { title: "Visual Design Systems", desc: "Cohesive typographic rules, vector guidelines, and style frameworks that define your brand voice.", price: "$1,499" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "A Partnership Focused on Growth",
          subtitle: "We prioritize security, styling coordination, and clean execution.",
          items: [
            { title: "Direct Communication Channels", desc: "Slack channels directly with lead software engineers and creative directors. No middle-men.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" },
            { title: "100% Code Ownership", desc: "Every template, asset file, and database setup compiled for you belongs entirely to your business.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Let's Build Something Great",
          subtitle: "Drop us a line and our deployment team will coordinate a project review walkthrough session.",
          email: "projects@apexagency.com",
          phone: "+1 (800) 555-0199",
          address: "Agency Headquarters, Suite 400, Silicon Valley, CA"
        }
      }
    ]
  },
  {
    id: "portfolio",
    name: "Creative Portfolio",
    desc: "Elegant resume and case studies view for designers, developers, and creators.",
    domain: "Creative / Business",
    sections: [
      {
        type: "hero",
        variant: "creative",
        props: {
          title: "Hi, I'm Alex. I Design Interfaces that Code.",
          subtitle: "A software architect designing coordinated HSL color systems, responsive web interfaces, and high-performance serverless backends.",
          ctaText: "Explore Work",
          ctaLink: "#benefits",
          image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Technical Skillset Matrix",
          subtitle: "A detailed breakdown of my engineering and styling capabilities.",
          items: [
            { title: "Frontend Engineering", desc: "Expertise in React, Next.js, Tailwind, and Framer Motion layout structures.", icon: "palette" },
            { title: "Backend Systems", desc: "Mongoose database schemas, Node APIs, and serverless logic layers.", icon: "code" },
            { title: "Performance Tuning", desc: "Optimizing contentful paint metrics, bundles size, and edge caching headers.", icon: "zap" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "minimal",
        props: {
          title: "Selected Case Studies",
          subtitle: "A look at recent professional milestones deployed to production.",
          items: [
            { title: "ApexFlow Cloud OS", desc: "Led the frontend design of a serverless workflow builder, optimizing canvas render loops.", image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop" },
            { title: "Chroma styling system", desc: "Implemented coordinate color token generators mapping database weights to HSL ranges.", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Interested in Collaborating?",
          subtitle: "I am currently open to freelance contracts and consulting engagements.",
          email: "alex@designscode.dev",
          phone: "+1 (800) 555-0145"
        }
      }
    ]
  },
  {
    id: "local",
    name: "Local Business",
    desc: "A clean layout with clear hours, services list menu, FAQ, and local contact map widget.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "minimal",
        props: {
          title: "Professional Service, Straight To Your Door",
          subtitle: "Providing high-fidelity parameters tuning, diagnostic reviews, and installation setups with clear, upfront pricing.",
          ctaText: "Book An Appointment",
          ctaLink: "#contact"
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Our Services Menu",
          subtitle: "Upfront service packages without hidden fees or dynamic consultation costs.",
          items: [
            { title: "Standard Consultation", desc: "A 1-hour walkthrough session reviewing your installation parameters.", price: "$99" },
            { title: "Premium Package Setup", desc: "Full software configuration, parameter adjustments, and validation testing.", price: "$349" },
            { title: "Monthly Maintenance Support", desc: "Priority support, routine diagnostic scans, and compliance verification checks.", price: "$49/mo" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Visit Our Office",
          subtitle: "Stop by or call us directly to check same-day session availability.",
          email: "office@localservicing.com",
          phone: "+1 (800) 555-0145",
          address: "100 Main Street, Suite A, Silicon Valley, CA"
        }
      },
      {
        type: "faq",
        variant: "modern",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Clear answers to resolve standard operational procedures.",
          items: [
            { q: "What are your opening hours?", a: "We are open Monday through Friday from 9 AM to 6 PM, and Saturday by appointment only." },
            { q: "Do you offer remote online sessions?", a: "Yes, all our consulting audits can be conducted virtually via video conference." }
          ]
        }
      }
    ]
  },
  {
    id: "blog",
    name: "Personal Blog",
    desc: "A clean content hub for authors, with a welcoming banner, latest article posts, and newsletter signup.",
    domain: "Creative / Business",
    sections: [
      {
        type: "hero",
        variant: "minimal",
        props: {
          title: "Insights from the Ventrixa Hub",
          subtitle: "Weekly articles and tutorials written by software architects on visual interface design, database models, and web performance.",
          ctaText: "Read Latest Articles",
          ctaLink: "#features"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Latest Articles & Guides",
          subtitle: "Insights and tutorials compiled by our engineering team.",
          items: [
            { title: "Optimizing Next.js Page Speeds", desc: "How we configured dynamic styles mapping and reduced contentful paint.", icon: "zap" },
            { title: "Branding Systems with HSL", desc: "A guide on HSL color palette hashing and dynamic contrast calculations.", icon: "palette" },
            { title: "Designing MongoDB Schemas", desc: "Structuring document models for live preview drag-and-drop workspace editors.", icon: "code" }
          ]
        }
      },
      {
        type: "about",
        variant: "minimal",
        props: {
          title: "About the Creator",
          subtitle: "Redefining modern visual web builder capabilities.",
          text: "Hi, I'm the writer behind Ventrixa. My goal is to write about styling alignment, responsive static layouts, and software architectures that help developers scale.",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "cta",
        variant: "modern",
        props: {
          title: "Join the Newsletter",
          subtitle: "Get high-octane engineering updates and layouts tutorials delivered directly to your inbox.",
          buttonText: "Subscribe Free",
          buttonLink: "#"
        }
      }
    ]
  },
  {
    id: "cafe",
    name: "Cafe & Restaurant",
    desc: "Cozy layout with hero food imagery, menu list, client testimonials, and reservation details.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "modern",
        props: {
          title: "Artisanal Coffee & Organic Bites",
          subtitle: "Sourcing local beans and seasonal ingredients to craft a premium morning ritual in the heart of Silicon Valley.",
          ctaText: "View Our Menu",
          ctaLink: "#services",
          image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "The Coffee & Food Menu",
          subtitle: "Crafted with passion using certified organic elements.",
          items: [
            { title: "Pour-Over Single Origin", desc: "Rotating single-origin beans slowly brewed to extract delicate floral and citrus notes.", price: "$6.50" },
            { title: "Avocado Sourdough Toast", desc: "Fresh avocado, organic cherry tomatoes, feta, and microgreens on baked sourdough toast.", price: "$14.00" },
            { title: "House Crafted Lavender Latte", desc: "Double espresso with steamed oat milk infused with sweet organic lavender syrup.", price: "$7.00" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "Our Cafe Experience",
          subtitle: "Why regulars choose to work and connect in our welcoming environment.",
          items: [
            { title: "High-Speed Wi-Fi & Power", desc: "Designed with dedicated workspace bars and quiet tables optimized for remote developers.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" },
            { title: "Direct Farmer Sourcing", desc: "We pay fair premiums directly to growers in Colombia and Ethiopia to support sustainable farms.", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Visit Us or Order Ahead",
          subtitle: "Stop by or give us a call to prepare your order for immediate pickup.",
          email: "orders@brewhousecafe.com",
          phone: "+1 (800) 555-0145",
          address: "Brew House Cafe, 150 espresso Way, Silicon Valley, CA"
        }
      }
    ]
  },
  {
    id: "gym",
    name: "Fitness & Gym",
    desc: "Energetic layout highlighting gym training plans, coaches, and schedule details.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "futuristic",
        props: {
          title: "Unleash Your Physical Potential",
          subtitle: "High-intensity athletic training, functional strength classes, and dedicated coach mentoring to build a bulletproof physique.",
          ctaText: "Book Free Class",
          ctaLink: "#pricing",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Training Pillars",
          subtitle: "A systematic approach designed to optimize strength and recovery.",
          items: [
            { title: "Functional Strength", desc: "Multi-joint compound movements building durable athletic foundations.", icon: "cpu" },
            { title: "Cardio Conditioning", desc: "Staggered high-intensity intervals increasing aerobic capacity.", icon: "zap" },
            { title: "Active Recovery", desc: "Mobility sequences and hydration metrics keeping your muscles aligned.", icon: "sliders" }
          ]
        }
      },
      {
        type: "pricing",
        variant: "modern",
        props: {
          title: "Membership Tiers",
          subtitle: "No contract locking. Cancel or change plans anytime.",
          tiers: [
            { name: "Basic", price: "$59", period: "month", features: ["Access to gym floor", "Locker room amenities", "Standard group classes"], popular: false },
            { name: "Athletic Club", price: "$99", period: "month", features: ["24/7 Gym access key", "Unlimited classes access", "1 Coach consultation", "Recovery lounge"], popular: true },
            { name: "Private Coach", price: "$299", period: "month", features: ["Custom workout routines", "3 Private training sessions", "Nutrition dashboard tracking", "Priority lounge space"], popular: false }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Start Your Athletic Journey",
          subtitle: "Our facility is located on the edge of Silicon Valley. Visit us today to tour the campus.",
          email: "welcome@apexathletics.com",
          phone: "+1 (800) 555-0145",
          address: "Apex Athletics Campus, Strength Ave, Silicon Valley, CA"
        }
      }
    ]
  },
  {
    id: "law",
    name: "Law Firm & Legal",
    desc: "Luxury styling tailored for legal counselors, law firms, and consulting corporate entities.",
    domain: "Professional Services",
    sections: [
      {
        type: "hero",
        variant: "luxury",
        props: {
          title: "Sovereign Counsel. Strategic Defense.",
          subtitle: "Providing legal representation, compliance consulting, and transaction advisory services for high-growth corporate entities.",
          ctaText: "Request Consultation",
          ctaLink: "#contact",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Our Practice Areas",
          subtitle: "Focused legal counsel structured to mitigate corporate risk.",
          items: [
            { title: "Intellectual Property", desc: "Securing patents, trademarks, and copyright software blueprints from competitor infringement.", price: "$350/hr" },
            { title: "Corporate Governance", desc: "Advising boards on regulatory compliance, shareholder agreements, and capital raises.", price: "$400/hr" },
            { title: "Commercial Litigation", desc: "Strategic arbitration and dispute resolution protecting your operational interests.", price: "$450/hr" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "Uncompromising Integrity",
          subtitle: "Why founders trust our firm with their critical assets.",
          items: [
            { title: "Decades of Corporate Experience", desc: "We've advised tech startups and global corporations through complex acquisitions and regulatory inquiries.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" },
            { title: "Pragmatic Business Focus", desc: "We align legal advice with your commercial objectives, avoiding unnecessary billable hour friction.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Schedule Confidential Intake",
          subtitle: "Submit a summary of your inquiry to schedule a preliminary review with our partners.",
          email: "intake@vanelegal.com",
          phone: "+1 (800) 555-0199",
          address: "Vane & Partners LLP, Legal Towers, Silicon Valley, CA"
        }
      }
    ]
  },
  {
    id: "saasapp",
    name: "SaaS App Landing",
    desc: "A layout highlighting app interfaces, mobile screenshots, and client testimonials.",
    domain: "SaaS / Tech",
    sections: [
      {
        type: "hero",
        variant: "futuristic",
        props: {
          title: "Data Sync Pipelines. Simplified.",
          subtitle: "The lightweight edge synchronizer that automates file tracking, code updates, and layout backups directly from your terminal.",
          ctaText: "Download Application",
          ctaLink: "#pricing",
          image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Core Functionality",
          subtitle: "Advanced parameters packaged behind a simple user interface.",
          items: [
            { title: "Instant Edge Uploads", desc: "Upload and compress image assets directly to global server distributions.", icon: "zap" },
            { title: "Undo-Redo History", desc: "Full tracking log maps, allowing you to rollback canvas states in one click.", icon: "sliders" },
            { title: "Attributions Widget", desc: "Automatically bundle OpenGraph tags and metadata files for SEO rating boosts.", icon: "cpu" }
          ]
        }
      },
      {
        type: "testimonials",
        variant: "modern",
        props: {
          title: "Feedback from our Users",
          subtitle: "Discover how development teams are accelerating setup times with Ventrixa.",
          items: [
            { name: "Sarah Jenkins", role: "Software Architect", quote: "Switching to this builder was a game-changer. The layout arrays saved us days of manual page compilation.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
            { name: "David Chen", role: "CTO, TechNetwork", quote: "The Edge deployment is fast. Our pages load instantly globally. The HSL palette suggestion was spot on.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "cta",
        variant: "modern",
        props: {
          title: "Start Building Better Interfaces Today",
          subtitle: "No setup fee, no credit card required. Experience high-octane visual sandbox editing.",
          buttonText: "Register Account",
          buttonLink: "#"
        }
      }
    ]
  },
  {
    id: "corporate",
    name: "Corporate Website",
    desc: "Structured, professional template with corporate about text, services, and client stories.",
    domain: "Professional Services",
    sections: [
      {
        type: "hero",
        variant: "minimal",
        props: {
          title: "Enterprise Solutions. Measured Results.",
          subtitle: "We coordinate operational guidelines, optimize corporate architectures, and compile compliance structures to scale your business.",
          ctaText: "Schedule Business Audit",
          ctaLink: "#services"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Governance & Operations",
          subtitle: "Systematic workflows designed to eliminate digital friction.",
          items: [
            { title: "Risk Mitigation", desc: "Regular compliance audits mapping database variables and software security gaps.", icon: "shield" },
            { title: "Resource Optimization", desc: "Automated sync nodes managing team schedules and task entries.", icon: "sliders" },
            { title: "Compliance Synthesis", desc: "Generating compliant document layouts matching local industry guidelines.", icon: "cpu" }
          ]
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Corporate Audit Packages",
          subtitle: "Professional service engagements structured to optimize efficiency.",
          items: [
            { title: "Infrastructure Audit", desc: "Comprehensive analysis of cloud data systems, caching layers, and backup frameworks.", price: "$4,999" },
            { title: "Workflow Consulting", desc: "Aligning team communication channels and establishing standardized layout rules.", price: "$2,499" }
          ]
        }
      },
      {
        type: "testimonials",
        variant: "modern",
        props: {
          title: "Enterprise Case Studies",
          subtitle: "Real outcomes achieved for our global corporate partners.",
          items: [
            { name: "Robert Vance", role: "VP of Operations, CloudSync", quote: "Their operational audit mapped critical bottlenecks in our database replication flow, saving us over $100k.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
          ]
        }
      }
    ]
  },
  {
    id: "education",
    name: "Online Course Platform",
    desc: "Tailored for educators and universities, featuring curriculum modules and enrollment details.",
    domain: "Education / Training",
    sections: [
      {
        type: "hero",
        variant: "modern",
        props: {
          title: "Master Technical Skillsets Online",
          subtitle: "Self-paced video curricula, interactive sandbox workspaces, and direct developer support channels to level up your engineering career.",
          ctaText: "Explore Courses",
          ctaLink: "#services",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Curriculum Features",
          subtitle: "A structured learning path designed to build actual software blueprints.",
          items: [
            { title: "Video On Demand", desc: "Watch high-fidelity lessons reviewing visual editor setups and CSS details.", icon: "cpu" },
            { title: "Live Sandbox Tasks", desc: "Code exercises running inside pre-configured mock environments.", icon: "code" },
            { title: "Certified Graduation", desc: "Receive digital credentials verifying your schema styling capabilities.", icon: "shield" }
          ]
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Available Academies",
          subtitle: "Structured modules taught by experienced industry practitioners.",
          items: [
            { title: "Advanced Next.js Architecture", desc: "Learn layout compilation, dynamic database hooks, and edge routing logic.", price: "$199" },
            { title: "Responsive CSS & HSL styling", desc: "Design coordinated color systems and resizable component structures.", price: "$99" }
          ]
        }
      },
      {
        type: "faq",
        variant: "modern",
        props: {
          title: "Course Questions",
          subtitle: "Fast answers regarding enrollment and curriculum access.",
          items: [
            { q: "Is there a certificate of completion?", a: "Yes, you receive a cryptographically verified digital certificate once you pass all sandbox validation tests." },
            { q: "Can I request a refund if not satisfied?", a: "Yes, we offer a 14-day refund period for all course enrollments, no questions asked." }
          ]
        }
      }
    ]
  },
  {
    id: "medical",
    name: "Medical Clinic",
    desc: "Soft light layouts suited for clinics, dental centers, and healthcare providers.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "minimal",
        props: {
          title: "Compassionate Care. Advanced Diagnostics.",
          subtitle: "Providing diagnostic consults, preventative treatments, and specialized medical therapies in a modern, welcoming environment.",
          ctaText: "Schedule Intake Appointment",
          ctaLink: "#contact"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Healthcare Pillars",
          subtitle: "Our commitement to patient safety and diagnostic excellence.",
          items: [
            { title: "Modern Diagnostics", desc: "State-of-the-art imaging and laboratory screening systems.", icon: "cpu" },
            { title: "Patient Security", desc: "Encrypted health records compliance matching international regulations.", icon: "shield" },
            { title: "Coordinated Treatment", desc: "Multi-disciplinary reviews ensuring aligned healthcare pipelines.", icon: "sliders" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Contact Our Clinic",
          subtitle: "Our medical facility is located in Central Silicon Valley. Reach out to verify doctor availability.",
          email: "care@siliconclinic.com",
          phone: "+1 (800) 555-0145",
          address: "Silicon Valley Health Center, Clinic Dr, Silicon Valley, CA"
        }
      },
      {
        type: "faq",
        variant: "modern",
        props: {
          title: "Patient Information FAQs",
          subtitle: "Clear guidelines regarding insurance billing and diagnostic bookings.",
          items: [
            { q: "Do you accept major insurance plans?", a: "Yes, we coordinate directly with major health providers. Contact our office to verify your policy coverage." },
            { q: "How do I request patient records?", a: "Submit an authorized request form through our secure online intake portal." }
          ]
        }
      }
    ]
  },
  {
    id: "realestate",
    name: "Real Estate Agency",
    desc: "Luxury photography-driven templates optimized for brokers and property listings.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "luxury",
        props: {
          title: "Exclusive Properties. Sovereign Living.",
          subtitle: "Discover luxury residential listings, commercial development locations, and custom estates in Silicon Valley's premium neighborhoods.",
          ctaText: "View Featured Estates",
          ctaLink: "#benefits",
          image: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Brokerage Solutions",
          subtitle: "Full-service real estate advisors coordinating your acquisitions.",
          items: [
            { title: "Off-Market Sourcing", desc: "Access premium estates and land parcels not listed on standard public platforms.", icon: "zap" },
            { title: "Asset Valuations", desc: "Thorough market analysis reviews calculating styling parameters and valuation weights.", icon: "trending-up" },
            { title: "Transaction Governance", desc: "Managing legal escrow accounts, transfer certs, and contract agreements.", icon: "shield" }
          ]
        }
      },
      {
        type: "benefits",
        variant: "modern",
        props: {
          title: "Featured Real Estate Listings",
          subtitle: "Bespoke properties curated for immediate acquisition.",
          items: [
            { title: "The Crestwood Estate", desc: "A modern architectural masterpiece featuring smart home integration, infinity pool, and custom landscaping.", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop" },
            { title: "Silicon Office Tower", desc: "Premium commercial office space optimized for scaling startup teams.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Schedule Property Tour",
          subtitle: "Connect with our real estate brokers to schedule a private walkthrough of our active listings.",
          email: "brokerage@crestwoodrealty.com",
          phone: "+1 (800) 555-0199"
        }
      }
    ]
  },
  {
    id: "event",
    name: "Event & Conference",
    desc: "Dynamic layout showing event speakers, ticket pricing tiers, and contact schedule.",
    domain: "Creative / Business",
    sections: [
      {
        type: "hero",
        variant: "futuristic",
        props: {
          title: "Ventrixa Dev Summit 2026",
          subtitle: "The premier developer gathering reviewing next-gen web builder compilers, HSL colors hashing, and edge rendering architectures.",
          ctaText: "Purchase Conference Pass",
          ctaLink: "#pricing",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "features",
        variant: "modern",
        props: {
          title: "Keynote Tracks",
          subtitle: "Highlighting core tech subjects reviewed during the conference sessions.",
          items: [
            { title: "Visual Sandboxes", desc: "Interactive builder sessions detailing drag-and-drop render pipelines.", icon: "palette" },
            { title: "Edge Caching Arrays", desc: "Optimizing page load speeds and provisioning SSL cert parameters.", icon: "zap" },
            { title: "Database Schema Rules", desc: "Structuring MongoDB documents for real-time live preview editors.", icon: "code" }
          ]
        }
      },
      {
        type: "pricing",
        variant: "modern",
        props: {
          title: "Conference Passes",
          subtitle: "Select a pass level to reserve your seat at the summit.",
          tiers: [
            { name: "General Admission", price: "$199", period: "pass", features: ["Access to main stage", "Lanyard & swag bag", "Community Discord slot"], popular: false },
            { name: "Developer Pass", price: "$399", period: "pass", features: ["Access to all workshops", "Lunch & dinner catering", "Interactive sandbox seats", "Uptime SLA check"], popular: true },
            { name: "VIP Experience", price: "$899", period: "pass", features: ["Private speaker lounge access", "1-on-1 consultation audit", "Front-row keynote seats", "Afterparty ticket"], popular: false }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Venue & Lodging Details",
          subtitle: "The conference is hosted at the Silicon Convention Hub. Submit inquiries for group ticket discounts.",
          email: "summit@ventrixa.site",
          phone: "+1 (800) 555-0145",
          address: "Silicon Convention Hub, Hall C, Silicon Valley, CA"
        }
      }
    ]
  },
  {
    id: "barber",
    name: "Barber & Salon",
    desc: "Creative retro-modern template showing styling treatments, hours, and bookings.",
    domain: "Local Services",
    sections: [
      {
        type: "hero",
        variant: "creative",
        props: {
          title: "Precision Haircuts. Classic Grooming.",
          subtitle: "Combining classic barbering methods with contemporary design themes to deliver premium treatments in Silicon Valley.",
          ctaText: "Book Styling Session",
          ctaLink: "#services",
          image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
        }
      },
      {
        type: "services",
        variant: "modern",
        props: {
          title: "Grooming Menu",
          subtitle: "Premium barbering treatments tailored to your request.",
          items: [
            { title: "Signature Haircut & Style", desc: "Detailed consultation, wash, precision cut, and styling styling pomade.", price: "$65" },
            { title: "Hot Towel Straight Shave", desc: "Traditional straight-razor shave with hot towel steam and premium soothing facial oils.", price: "$50" },
            { title: "Beard trim & Grooming", desc: "Beard shaping, mustache trim, lining, and conditioning oil application.", price: "$35" }
          ]
        }
      },
      {
        type: "contact",
        variant: "modern",
        props: {
          title: "Walk-ins Welcome",
          subtitle: "Stop by the shop or call us to reserve a specific barber seat.",
          email: "cuts@vanebarbershop.com",
          phone: "+1 (800) 555-0145",
          address: "Vane Barber Shop, Grooming Way, Silicon Valley, CA"
        }
      }
    ]
  }
];

export function getTemplateById(id: string): TemplateItem | undefined {
  return READY_TEMPLATES.find((t) => t.id === id);
}
