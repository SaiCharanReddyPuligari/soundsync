// import StreamView from "@/app/components/StreamView";

// type Params = Promise<{ creatorId: string }>;

// interface CreatorProps {
//   params: Params;
// }

// const Creator = async ({ params }: CreatorProps) => {
//   console.log(params);
//   const { creatorId } = await params;

//   // Optional: You can use state here if needed for additional logic

//   return <StreamView creatorId={creatorId} playVideo={false} />;
// };

// export default Creator;
// app/creator/[creatorId]/page.tsx

import { getServerSession } from "next-auth";
import StreamView from "@/app/components/StreamView";
import {prismaClient} from "@/app/lib/db"; // Adjust this import based on your prisma client location
import { redirect } from "next/navigation";

// We define the props type to match Next.js pages with dynamic routes
interface CreatorPageProps {
  params: {
    creatorId: string;
  };
}

async function CreatorPage({ params }: CreatorPageProps) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      redirect("/");
    }
    const user = await prismaClient.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      redirect("/");
    }

    return (
      <div className="container mx-auto">
        <StreamView creatorId={params.creatorId} playVideo={false} />
      </div>
    );

  } catch (error) {
    // If anything goes wrong during this process, we log it
    // and show a simple error message to the user
    console.error("Error in CreatorPage:", error);
    
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-red-500 text-xl">
          Something went wrong. Please try again later.
        </h1>
      </div>
    );
  }
}

export default CreatorPage;