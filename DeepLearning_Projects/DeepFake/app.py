import gradio as gr
import pipeline

# Custom CSS for larger interface
custom_css = """
.gradio-container {
    max-width: 1400px !important;
}
#component-0, #component-1, #component-2 {
    min-height: 500px !important;
}
.output-class {
    min-height: 300px !important;
    font-size: 24px !important;
    padding: 30px !important;
}
.input-image, .input-video, .input-audio {
    min-height: 500px !important;
}
"""

title="EfficientNetV2 Deepfakes Video Detector"
description="EfficientNetV2 Deepfakes Image Detector by using frame-by-frame detection."

# Image Interface with larger components
image_interface = gr.Interface(
    fn=pipeline.deepfakes_image_predict,
    inputs=gr.Image(label="Upload Image", height=500),
    outputs=gr.Textbox(label="Detection Result", lines=8, scale=2),
    examples=["images/images_lady.jpg", "images/images_fake_image.jpg"],
    cache_examples=False,
    title="Image Deepfake Detection",
    description="Upload an image to detect if it's real or fake"
)

# Video Interface with larger components  
video_interface = gr.Interface(
    fn=pipeline.deepfakes_video_predict,
    inputs=gr.Video(label="Upload Video", height=500),
    outputs=gr.Textbox(label="Detection Result", lines=8, scale=2),
    examples=["videos/celeb_synthesis.mp4", "videos/real-1.mp4"],
    cache_examples=False,
    title="Video Deepfake Detection",
    description="Upload a video to detect if it's real or fake (frame-by-frame analysis)"
)

app = gr.TabbedInterface(
    interface_list=[image_interface, video_interface], 
    tab_names=['Image inference', 'Video inference'],
    css=custom_css
)

if __name__ == '__main__':
    # For local development
    import os
    is_local = os.environ.get('SPACE_ID') is None
    
    app.launch(
        share=False,
        inbrowser=is_local,  # Only open browser locally
        server_name="0.0.0.0" if not is_local else "127.0.0.1",
        server_port=7860
    )