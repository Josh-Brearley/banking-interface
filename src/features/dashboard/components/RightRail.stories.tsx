import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RightRail } from "./RightRail";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { writeSession } from "@/lib/auth/session";
import { makeUser } from "@/tests/fixtures";

/**
 * Dashboard side rail: who's signed in plus shortcuts. Reads the signed-in user
 * from `AuthProvider`, so the story seeds a session for the demo user (`usr_1`)
 * — the same path the app uses after login.
 */
const demoUser = makeUser({
  id: "usr_1",
  fullName: "Josh Brearley",
  email: "demo@eaglebank.com",
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: "Dashboard/RightRail",
  component: RightRail,
  tags: ["autodocs"],
  args: { accountsCount: 3 },
  decorators: [
    (Story) => {
      // Seed the persisted session so AuthProvider rehydrates the demo user.
      writeSession({ token: `mock.${btoa("usr_1")}.5`, user: demoUser });
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="max-w-xs">
              <Story />
            </div>
          </AuthProvider>
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof RightRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
