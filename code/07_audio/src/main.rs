fn main() {
    use hound;

    let spec = hound::WavSpec {
        channels: 1,
        sample_rate: 44100,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };
    let mut writer = hound::WavWriter::create("black.wav", spec).unwrap();
    for _ in (0..44100).map(|x| x as f32 / 44100.0) {
        let sample = 0.0;
        let amplitude = i16::MAX as f32;
        writer.write_sample((sample * amplitude) as i16).unwrap();
    }
    writer.finalize().unwrap();

    let mut writer = hound::WavWriter::create("white.wav", spec).unwrap();
    for _ in (0..44100).map(|x| x as f32 / 44100.0) {
        let sample = 0.1;
        let amplitude = i16::MAX as f32;
        writer.write_sample((sample * amplitude) as i16).unwrap();
    }
    writer.finalize().unwrap();
}
