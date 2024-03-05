import React, { useState } from "react";
import Draggable from "react-draggable";
import DragProto from "./DragProto";

function AudioTrimmer() {
  const [audioFile, setAudioFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(parseFloat(event.target.value));
  };

  const handleEndTimeChange = (event) => {
    setEndTime(parseFloat(event.target.value));
  };
  async function trimAudio() {
    if (!audioFile) {
      console.error("No audio file selected.");
      return;
    }

    // Create an AudioContext
    const audioContext = new AudioContext();

    // Read the uploaded audio file
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(audioFile);

    fileReader.onload = async () => {
      const audioBuffer = await audioContext.decodeAudioData(fileReader.result);

      // Create a buffer source node
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Calculate the start and end times in seconds
      const startInSeconds = startTime;
      const endInSeconds = endTime;

      // Trim the audio buffer
      const duration = endInSeconds - startInSeconds;
      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioContext.sampleRate * duration,
        audioContext.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const trimmedData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < trimmedBuffer.length; i++) {
          trimmedData[i] =
            channelData[i + startInSeconds * audioContext.sampleRate];
        }
      }

      // Create a buffer source node for the trimmed audio
      const trimmedSource = audioContext.createBufferSource();
      trimmedSource.buffer = trimmedBuffer;

      // Connect the trimmed audio source to the destination (speakers)
      trimmedSource.connect(audioContext.destination);

      // Start playing the trimmed audio
      trimmedSource.start();

      // Optionally, you can also export the trimmed audio as a new file
      // Please note, file export in the browser might have limited support and require additional libraries
    };

    fileReader.onerror = () => {
      console.error("Error occurred while reading the file.");
    };
  }

  return (
    <div>
      {/* <input type="file" accept="audio/*" onChange={handleFileChange} />
      <div>
        <label>Start Time:</label>
        <input
          type="number"
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </div>
      <div>
        <label>End Time:</label>
        <input type="number" value={endTime} onChange={handleEndTimeChange} />
      </div>
      <button onClick={trimAudio}>Trim Audio</button>
       */}
      <DragProto />
    </div>
  );
}

export default AudioTrimmer;
