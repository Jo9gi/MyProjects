import argparse
import time
from typing import List, Tuple

import cv2
import numpy as np
from ultralytics import YOLO


def iou_xyxy(a: Tuple[int, int, int, int], b: Tuple[int, int, int, int]) -> float:
    """IoU between two [x1,y1,x2,y2] boxes."""
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)

    iw = max(0, inter_x2 - inter_x1)
    ih = max(0, inter_y2 - inter_y1)
    inter = iw * ih
    if inter == 0:
        return 0.0

    area_a = (ax2 - ax1) * (ay2 - ay1)
    area_b = (bx2 - bx1) * (by2 - by1)
    union = area_a + area_b - inter
    return inter / max(union, 1e-6)


def center_inside(outer: Tuple[int, int, int, int], inner: Tuple[int, int, int, int]) -> bool:
    """True if the center of 'inner' is inside 'outer'."""
    ox1, oy1, ox2, oy2 = outer
    ix1, iy1, ix2, iy2 = inner
    cx = (ix1 + ix2) // 2
    cy = (iy1 + iy2) // 2
    return ox1 <= cx <= ox2 and oy1 <= cy <= oy2


def to_xyxy(box) -> Tuple[int, int, int, int]:
    """Ultralytics box to int xyxy tuple."""
    x1, y1, x2, y2 = box.xyxy[0].tolist()
    return int(x1), int(y1), int(x2), int(y2)


def main(args):
    # --- load models ---
    # Person model (COCO), class 0 = 'person'
    person_model = YOLO(args.person_weights)         # e.g. 'yolov8n.pt'
    # Your trained ID model (Cards + Lanyard)
    id_model = YOLO(args.id_weights)                 # e.g. 'weights/best.pt'

    # Resolve class names of the ID model (lowercased to be safe)
    id_names = {i: n.lower() for i, n in id_model.names.items()}
    valid_id_names = {"cards", "card", "lanyard"}    # accept both spellings
    # map your dataset labels to this set
    id_label_ok = {i for i, n in id_names.items() if n in valid_id_names}

    if not id_label_ok:
        print("⚠️ Could not match ID classes from your model names:", id_model.names)
        print("   Make sure your classes are named 'Cards' and/or 'Lanyard'.")
        return

    # --- open video ---
    cap = cv2.VideoCapture(args.source)
    if args.width:  cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
    if args.height: cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)

    if not cap.isOpened():
        print("❌ Could not open video source:", args.source)
        return

    print("✅ Running…  Press 'q' to quit.")
    prev = time.time()
    fps = 0.0

    while True:
        ok, frame = cap.read()
        if not ok:
            print("⚠️ Failed to read frame.")
            break

        # --- run detectors ---
        # Detect persons only (class 0)
        p_results = person_model.predict(
            frame, classes=[0], conf=args.person_conf, iou=args.iou, verbose=False, device=args.device
        )
        # Detect IDs (cards/lanyard)
        id_results = id_model.predict(
            frame, conf=args.id_conf, iou=args.iou, verbose=False, device=args.device
        )

        person_boxes: List[Tuple[int, int, int, int]] = []
        id_boxes: List[Tuple[int, int, int, int]] = []

        if len(p_results):
            for b in p_results[0].boxes:
                person_boxes.append(to_xyxy(b))

        if len(id_results):
            for b in id_results[0].boxes:
                cls_id = int(b.cls[0])
                if cls_id in id_label_ok:
                    id_boxes.append(to_xyxy(b))

        # --- decide per-person coloring ---
        wearing_count = 0
        for pb in person_boxes:
            # any id overlaps or lies inside this person?
            has_id = any(
                iou_xyxy(pb, ib) >= args.match_iou or center_inside(pb, ib)
                for ib in id_boxes
            )
            if has_id:
                wearing_count += 1
                color = (0, 200, 0)   # green
                label = "with_ID"
            else:
                color = (0, 0, 255)   # red
                label = "without_ID"

            x1, y1, x2, y2 = pb
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, max(20, y1-10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        # --- overlay counts + FPS ---
        now = time.time()
        fps = 0.9 * fps + 0.1 * (1.0 / max(now - prev, 1e-6))
        prev = now

        total_people = len(person_boxes)
        text = f"People: {total_people}  |  With ID: {wearing_count}  |  FPS: {fps:.1f}"
        cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (240, 240, 240), 2)

        cv2.imshow("ID Card Status (YOLOv8)", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--id-weights",  default="weights/best.pt", help="Path to your trained ID model")
    parser.add_argument("--person-weights", default="yolov8n.pt",  help="COCO model for person detection")
    parser.add_argument("--source", type=int, default=0, help="Webcam index or video path")
    parser.add_argument("--device", default=None, help="cuda, cpu, or index (e.g., 0). None = auto")
    parser.add_argument("--id-conf", type=float, default=0.35)
    parser.add_argument("--person-conf", type=float, default=0.40)
    parser.add_argument("--iou", type=float, default=0.50)
    parser.add_argument("--match-iou", type=float, default=0.05, help="IoU threshold to match ID to person")
    parser.add_argument("--width", type=int, default=0, help="Optional capture width")
    parser.add_argument("--height", type=int, default=0, help="Optional capture height")
    args = parser.parse_args()
    main(args)
