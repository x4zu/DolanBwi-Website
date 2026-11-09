import { SiteHeader } from "@/components/SiteHeader";
import { DoorHero } from "@/components/hero/DoorHero";
import { Prologue } from "@/components/Prologue";
import { ExploreBanyuwangi } from "@/components/ExploreBanyuwangi";
import { DayJourney } from "@/components/DayJourney";
import { LandscapeStack } from "@/components/LandscapeStack";
import { Epilogue } from "@/components/Epilogue";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <DoorHero />
        <Prologue />
        <ExploreBanyuwangi />
        <DayJourney />
        <LandscapeStack />
        <Epilogue />
      </main>
      <SiteFooter />
    </>
  );
}
