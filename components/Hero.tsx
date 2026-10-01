// import { MapPin, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
// import { Github, Linkedin } from "./icons";
// const links = [
//   { Icon: Github, label: "GitHub", href: "https://github.com/venkateshmadari" },
//   {
//     Icon: Linkedin,
//     label: "LinkedIn",
//     href: "https://linkedin.com/in/venkateshmadari/",
//   },
//   { Icon: Mail, label: "Mail", href: "mailto:venkateshmadari07@gmail.com" },
//   { Icon: MessageCircle, label: "venkatesh_dev_39927", href: "" },
// ];
// import Section from "./Section";
// import ProfileShuffle from "./ProfileShuffle";
// import Image from "next/image";
// import ProfileBanner from "./ProfileBanner";
// const bullets = [
//   "Hey, I'm Venkatesh, a full-stack developer with 2+ years of experience building and scaling production SaaS applications with React.js, Next.js, Node.js, and Express.js.",
//   "I work across the stack, from RESTful API design secured with JWT, RBAC and PBAC to cloud-native, high-availability AWS architecture: EC2 Auto Scaling, ALB, RDS, S3, CloudFront, ElastiCache and Route 53.",
//   "I care about performance and reliability, and I back it up with load testing. I build best when I can ship something that holds up in production.",
// ];
// export default function Hero() {
//   return (
//     <>
//       {/* <div className="border-b border-white/10 p-3 sm:p-4">
//         <div className="h-[110px] w-full rounded-sm bg-gradient-to-r from-blue-900 via-yellow-500/80 to-blue-700 sm:h-[120px]" />
//       </div> */}
//       <ProfileBanner />
//       <div className="flex items-center gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
//         {/* <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-neutral-800 font-serif text-2xl text-white">
//           MV
//         </div> */}
//         <ProfileShuffle />
//         <div className="flex-1">
//           {/* 6C82DB */}
//           <h1 className="font-serif text-[28px] leading-none text-primary">
//             Madari Venkatesh
//           </h1>
//           <p className="mt-1 font-mono text-[11px] text-neutral-200">
//             Full Stack Developer
//           </p>
//           <p className="mt-1 flex items-center gap-2 font-mono text-[10px] text-neutral-400">
//             <MapPin size={10} />
//             Hyderabad, India
//           </p>
//         </div>
//         <a
//           href="#contact"
//           className="hidden h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[10px] text-neutral-400 sm:flex"
//         >
//           Hire me
//         </a>
//       </div>
//       <Section id="about" title="Hello, World" right={null}>
//         <ul className="space-y-4 px-4 py-5 text-[13px] leading-[20px] text-neutral-300 sm:px-6">
//           {bullets.map((b) => (
//             <li key={b} className="flex gap-3 ">
//               <span className="mt-2 size-1 shrink-0 rounded-full bg-neutral-500" />
//               {b}
//             </li>
//           ))}
//         </ul>
//         <div className="mx-4 mb-6 rounded-md border border-white/10 bg-white/[.02] p-4 sm:mx-6">
//           <p className="mb-3 font-mono text-[10px] font-bold tracking-widest text-neutral-300">
//             DEVELOPER SNAPSHOT
//           </p>
//           <div className="grid grid-cols-1 gap-2 font-mono text-[11px] text-neutral-400 sm:grid-cols-2">
//             {[
//               "Scaling SaaS systems.",
//               "Deploying on AWS.",
//               "Implementing system designs",
//               "Shipping on time.",
//             ].map((t) => (
//               <p key={t}>
//                 <span className="mr-2 text-emerald-400">•</span>
//                 {t}
//               </p>
//             ))}
//           </div>
//         </div>
//       </Section>
//       <Section id="contact" title="Let's Connect">
//         <div className="grid grid-cols-2 divide-x divide-white/10 text-[12px] text-neutral-300 sm:grid-cols-4">
//           {links.map(({ Icon, label, href }) =>
//             href ? (
//               <a
//                 key={label}
//                 href={href}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="flex items-center justify-between gap-2 px-4 py-3"
//               >
//                 <span className="flex items-center gap-2">
//                   <Icon size={14} className="text-primary" />
//                   {label}
//                 </span>
//                 <ArrowUpRight size={12} className="text-neutral-500" />
//               </a>
//             ) : (
//               <div
//                 key={label}
//                 title="Discord"
//                 className="flex items-center gap-2 px-4 py-3 font-mono text-[10px]"
//               >
//                 <Icon size={14} className="shrink-0 text-primary" />
//                 <span className="truncate">{label}</span>
//               </div>
//             ),
//           )}
//         </div>
//       </Section>
//     </>
//   );
// }


import {
  MapPin,
  Mail,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { Github, Linkedin } from "./icons";

const links = [
  {
    Icon: Github,
    label: "GitHub",
    href: "https://github.com/venkateshmadari",
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/venkateshmadari/",
  },
  {
    Icon: Mail,
    label: "Mail",
    href: "mailto:venkateshmadari07@gmail.com",
  },
  {
    Icon: FileText,
    label: "Resume",
    href: "/Madari_Venkatesh_Resume.pdf",
  },
];

import Section from "./Section";
import ProfileShuffle from "./ProfileShuffle";
import ProfileBanner from "./ProfileBanner";

const bullets = [
  "Hey, I'm Venkatesh, a full-stack developer with 2+ years of experience building and scaling production SaaS applications with React.js, Next.js, Node.js, and Express.js.",
  "I work across the stack, from RESTful API design secured with JWT, RBAC and PBAC to cloud-native, high-availability AWS architecture: EC2 Auto Scaling, ALB, RDS, S3, CloudFront, ElastiCache and Route 53.",
  "I care about performance and reliability, and I back it up with load testing. I build best when I can ship something that holds up in production.",
];

export default function Hero() {
  return (
    <>
      <ProfileBanner />

      <div className="flex items-center gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <ProfileShuffle />

        <div className="flex-1">
          <h1 className="font-serif text-[28px] leading-none text-primary">
            Madari Venkatesh
          </h1>

          <p className="mt-1 font-mono text-[11px] text-neutral-200">
            Full Stack Developer
          </p>

          <p className="mt-1 flex items-center gap-2 font-mono text-[10px] text-neutral-400">
            <MapPin size={10} />
            Hyderabad, India
          </p>
        </div>

        <a
          href="#contact"
          className="hidden h-8 items-center rounded-md border border-white/15 px-3 font-mono text-[10px] text-neutral-400 sm:flex"
        >
          Hire me
        </a>
      </div>

      <Section id="about" title="Hello, World" right={null}>
        <ul className="space-y-4 px-4 py-5 text-[13px] leading-[20px] text-neutral-300 sm:px-6">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-neutral-500" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mx-4 mb-6 rounded-md border border-white/10 bg-white/[.02] p-4 sm:mx-6">
          <p className="mb-3 font-mono text-[10px] font-bold tracking-widest text-neutral-300">
            DEVELOPER SNAPSHOT
          </p>

          <div className="grid grid-cols-1 gap-2 font-mono text-[11px] text-neutral-400 sm:grid-cols-2">
            {[
              "Scaling SaaS systems.",
              "Deploying on AWS.",
              "Implementing system designs",
              "Shipping on time.",
            ].map((t) => (
              <p key={t}>
                <span className="mr-2 text-emerald-400">•</span>
                {t}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" title="Let's Connect">
        <div className="grid grid-cols-2 divide-x divide-white/10 text-[12px] text-neutral-300 sm:grid-cols-4">
          {links.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Icon size={14} className="text-primary" />
                {label}
              </span>

              <ArrowUpRight
                size={12}
                className="text-neutral-500"
              />
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}