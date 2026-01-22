import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSubjects, getUserProgress } from "@/actions/quiz-actions";
import { getDashboardData } from "@/actions/dashboard-stats";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/");
  }

  // Fetch all data in parallel
  const [subjects, userProgress, dashboardStats] = await Promise.all([
    getSubjects(),
    getUserProgress(),
    getDashboardData(),
  ]);

  // Serialize user object for client component
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
      }
    : null;

  return (
    <DashboardClient
      user={serializedUser}
      subjects={subjects}
      userProgress={userProgress}
      dashboardStats={dashboardStats}
    />
  );
}
