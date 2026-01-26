import { Users, FileText, CreditCard, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { LucideIcon } from "lucide-react";

type DashboardCard = {
  title: string;
  count: number | string;
  link?: string;
  icon: LucideIcon;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "Staff Users",
    count: 5,
    link: "/staff",
    icon: Users,
  },
  {
    title: "Distributor Users",
    count: 8,
    link: "/distributor",
    icon: Users,
  },
  {
    title: "Retailer Users",
    count: 348,
    link: "/retailer",
    icon: Users,
  },
  {
    title: "ITR",
    count: 7920,
    link: "/itr-application",
    icon: FileText,
  },
  {
    title: "PAN CARD",
    count: 28071,
    link: "/pan-application",
    icon: CreditCard,
  },
  {
    title: "Ladger Users",
    count: 0,
    link: "/ladger",
    icon: BookOpen,
  },
];

export function SectionCards() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Welcome to Dashboard administrator</h1>
        <Button asChild variant="destructive">
          <Link to="/referral/add">Referral New Account</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link || "#"}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-muted-foreground truncate">
                      {card.title}
                    </span>
                    <span className="text-3xl font-bold tracking-tight">
                      {card.count.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
