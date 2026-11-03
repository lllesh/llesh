import { createFileRoute, notFound } from "@tanstack/react-router";
import { SectionPage } from "@/imports/femea/components/section-page";
import { topicsBySlug } from "@/imports/femea/lib/topics";

export const Route = createFileRoute("/femea/$slug")({
  loader: ({ params }) => {
    const topic = topicsBySlug.get(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.topic.title} — FÈMEA` },
          { name: "description", content: loaderData.topic.description },
        ]
      : [],
  }),
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useLoaderData();
  return (
    <SectionPage
      config={{
        eyebrow: topic.eyebrow,
        title: topic.title,
        description: topic.description,
        suggestions: topic.suggestions,
      }}
    />
  );
}
