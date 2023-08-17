const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const inputFilePath = "mybig.mp4"; // Replace with your input video file path
const outputFilePath = "mysmall.mp4";

const targetFileSizeMB = 450; // Adjust the target file size in megabytes

ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
  if (err) {
    console.error("Error reading input video:", err);
    return;
  }

  const inputDuration = metadata.format.duration;
  const inputBitrate = metadata.format.bit_rate;
  const inputWidth = metadata.streams[0].width;
  const inputHeight = metadata.streams[0].height;

  // Calculate the target video bitrate to achieve the desired file size
  const targetBitrate = Math.round((targetFileSizeMB * 8192) / inputDuration);

  try {
    console.log("Compression started");
    ffmpeg()
      .input(inputFilePath)
      .videoBitrate(targetBitrate)
      .output(outputFilePath)
      .outputOptions([
        "-c:v libx264",
        `-vf scale=${inputWidth}:${inputHeight}`
      ])
      .on("end", () => {
        console.log("Compression finished");
      })
      .on("error", (err) => {
        console.error("Error during compression:", err);
      })
      .run();
  } catch (error) {
    console.log("Error:", error);
  }
});
