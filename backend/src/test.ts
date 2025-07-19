import { TwelveLabs } from "twelvelabs-js";

const client = new TwelveLabs({ apiKey: "<YOUR_API_KEY>" });

const index = await client.index.create({
  name: "<YOUR_INDEX_NAME>",
  models: [{ name: "marengo2.7", options: ["visual", "audio"] }],
});
console.log(`Created index: id=${index.id} name=${index.name}`);

const task = await client.task.create({
  indexId: index.id,
  url: "<YOUR_VIDEO_URL>",
});
console.log(`Created task: id=${task.id}`);
await task.waitForDone(5000, (task) => {
  console.log(`  Status=${task.status}`);
});
if (task.status !== "ready") {
  throw new Error(`Indexing failed with status ${task.status}`);
}
console.log(
  `Upload complete. The unique identifier of your video is ${task.videoId}`
);

const searchResults = await client.search.query({
  indexId: index.id,
  queryText: "<YOUR_QUERY>",
  options: ["visual", "audio"],
});
for (const clip of searchResults.data) {
  console.log(
    `video_id=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
  );
}
