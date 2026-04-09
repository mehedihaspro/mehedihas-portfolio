import type { Metadata } from "next";
import { BlogPostClient } from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Sample data — will be replaced with Sanity query
const SAMPLE_POST = {
  title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না — Gamification Psychology",
  category: "Design Psychology",
  date: "March 28, 2026",
  readingTime: "8 min read",
  author: "mehedihas",
  hasAudio: true,
  audioDuration: "8:32",
  coverColor: "bg-[#2D5F2D]",
  tocItems: [
    { id: "intro", text: "Introduction", level: 2 },
    { id: "streak-psychology", text: "Streak Psychology", level: 2 },
    { id: "loss-aversion", text: "Loss Aversion কীভাবে কাজ করে", level: 3 },
    { id: "variable-rewards", text: "Variable Rewards", level: 2 },
    { id: "social-proof", text: "Social Proof & Competition", level: 2 },
    { id: "dark-patterns", text: "Dark Patterns নাকি Good Design?", level: 2 },
    { id: "takeaway", text: "Takeaway for Designers", level: 2 },
  ],
  sections: [
    {
      id: "intro",
      heading: "Introduction",
      content: `আপনি কি কখনো ভেবে দেখেছেন কেন Duolingo এর সবুজ পাখি আপনাকে এতটা guilty feel করায় যখন আপনি একদিন practice মিস করেন? কেন আপনি ঘুমানোর আগে শুধু একটা lesson complete করার জন্য phone তুলে নেন?

এটা কোনো coincidence না। এটা carefully designed behavioral psychology যা আপনার brain এর deepest reward mechanisms কে target করে। আজকে আমরা dive করব Duolingo এর gamification strategy তে এবং বুঝব কীভাবে তারা millions of users কে engaged রাখে।

Psychology এবং design এর intersection এ কিছু fascinating patterns আছে যা আমরা product designer হিসেবে শিখতে পারি।`,
    },
    {
      id: "streak-psychology",
      heading: "Streak Psychology",
      content: `Streak হলো Duolingo এর সবচেয়ে powerful retention tool। একটা simple counter যা বলে আপনি কতদিন consecutively practice করেছেন। কিন্তু এই simple counter এর পিছনে আছে deep psychological principles।

যখন আপনার 30-day streak আছে, আপনি শুধু একটা number দেখছেন না — আপনি 30 দিনের investment দেখছেন। এটা break করতে চাইবেন না কারণ আপনি already এতটা effort দিয়েছেন। Behavioral economics এ একে বলা হয় "sunk cost fallacy"।`,
    },
    {
      id: "loss-aversion",
      heading: "Loss Aversion কীভাবে কাজ করে",
      content: `Daniel Kahneman এবং Amos Tversky এর research থেকে আমরা জানি যে মানুষ loss কে gain এর চেয়ে প্রায় দ্বিগুণ strongly feel করে। Duolingo এটা masterfully exploit করে।

"আপনার 45-day streak হারাতে চলেছে!" — এই notification টা আসলে আপনাকে কিছু নতুন দিচ্ছে না, বরং আপনার existing achievement হারানোর ভয় তৈরি করছে। আর এই ভয়ই আপনাকে app open করতে বাধ্য করে।`,
    },
    {
      id: "variable-rewards",
      heading: "Variable Rewards",
      content: `Nir Eyal এর Hook Model অনুযায়ী, variable rewards হলো habit formation এর একটা core element। Duolingo এটা implement করে বিভিন্নভাবে — XP points, leaderboard positions, achievement badges, আর surprise rewards।

প্রতিবার আপনি lesson complete করেন, reward টা slightly different হয়। কখনো extra XP, কখনো একটা new badge, কখনো leaderboard এ position change। এই unpredictability আপনার dopamine system কে activate রাখে।

Variable ratio reinforcement schedule — casino machines ও exactly একই principle use করে।`,
    },
    {
      id: "social-proof",
      heading: "Social Proof & Competition",
      content: `Leaderboards, friend lists, আর weekly competitions — Duolingo জানে যে social comparison একটা powerful motivator। যখন আপনি দেখেন আপনার friend আপনার চেয়ে বেশি XP earn করেছে, আপনার competitive instinct kick in করে।

Robert Cialdini এর "Influence" বইতে social proof কে persuasion এর ছয়টা key principle এর একটা হিসেবে identify করা হয়েছে। Duolingo এটাকে gamification layer এর মধ্যে beautifully integrate করেছে।`,
    },
    {
      id: "dark-patterns",
      heading: "Dark Patterns নাকি Good Design?",
      content: `এখানে একটা important ethical question আছে — Duolingo এর techniques কি dark patterns? নাকি এগুলো genuinely helpful design decisions যা users কে তাদের learning goals achieve করতে সাহায্য করে?

আমার মতে, এটা depends on intent এবং outcome এর উপর। যদি user actually একটা language শিখছে এবং তার জীবনে value add হচ্ছে, তাহলে এই persuasive design techniques positive force হিসেবে কাজ করছে। কিন্তু যদি user anxious feel করে, guilty feel করে বিনা কারণে — তাহলে এটা cross করছে ethical boundaries।

Product designers হিসেবে আমাদের responsibility আছে এই line টা carefully navigate করার।`,
    },
    {
      id: "takeaway",
      heading: "Takeaway for Designers",
      content: `এই পুরো analysis থেকে আমরা কিছু key lessons নিতে পারি:

Understand your users' intrinsic motivations — external rewards কিছু সময়ের জন্য কাজ করে, কিন্তু long-term retention intrinsic motivation থেকে আসে।

Use loss aversion responsibly — এটা powerful tool, কিন্তু misuse করলে user trust হারাবেন।

Create meaningful progress indicators — streak শুধু একটা number না, এটা user এর journey এর visual representation।

Balance competition with collaboration — everyone wins যেন feel করে, শুধু top performers না।

Gamification ভালো design এর replacement না — fundamentals strong না হলে কোনো gamification layer কাজ করবে না।`,
    },
  ],
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: SAMPLE_POST.title,
    description: SAMPLE_POST.sections[0].content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return <BlogPostClient post={SAMPLE_POST} slug={slug} />;
}
