import tkinter as tk
from tkinter import ttk, messagebox
import random
import string
from PIL import Image, ImageTk

# --- Password Generator Function ---
def generate_password():
    try:
        length = int(length_var.get())
        if length <= 0:
            raise ValueError("Length must be positive")
    except ValueError:
        messagebox.showerror("Invalid Input", "Please enter a valid password length.")
        return

    chars = ""
    if use_lowercase.get():
        chars += string.ascii_lowercase
    if use_uppercase.get():
        chars += string.ascii_uppercase
    if use_digits.get():
        chars += string.digits
    if use_special.get():
        chars += string.punctuation

    if not chars:
        messagebox.showwarning("No Options Selected", "Please select at least one character type.")
        return

    password = "".join(random.choice(chars) for _ in range(length))
    password_var.set(password)
    check_strength(password)

# --- Password Strength Checker ---
def check_strength(password):
    strength = "Weak"
    if len(password) >= 12 and any(c.isdigit() for c in password) and any(c.isupper() for c in password) and any(c in string.punctuation for c in password):
        strength = "Strong"
    elif len(password) >= 8:
        strength = "Medium"
    strength_var.set(strength)

# --- Copy Password to Clipboard ---
def copy_to_clipboard():
    root.clipboard_clear()
    root.clipboard_append(password_var.get())
    messagebox.showinfo("Copied", "Password copied to clipboard!")

# --- Root Window ---
root = tk.Tk()
root.title("SecurePassX - Advanced Password Generator")
root.geometry("520x600")
root.resizable(False, False)
root.configure(bg="#F4F6F8")  # Light modern background color

# --- App Icon ---
try:
    root.iconbitmap("assets/icon.ico")
except Exception:
    print("⚠️ Icon not found, skipping...")

# --- Logo Section ---
try:
    logo_image = Image.open("assets/logo.png")
    logo_image = logo_image.resize((120, 120))
    logo_photo = ImageTk.PhotoImage(logo_image)
    logo_label = tk.Label(root, image=logo_photo, bg="#F4F6F8")
    logo_label.pack(pady=(20, 10))
except Exception:
    logo_label = tk.Label(root, text="🔒 SecurePassX", font=("Helvetica", 24, "bold"), fg="#2C3E50", bg="#F4F6F8")
    logo_label.pack(pady=(20, 10))

# --- Title ---
title_label = tk.Label(root, text="Advanced Password Generator", font=("Helvetica", 16, "bold"), fg="#2C3E50", bg="#F4F6F8")
title_label.pack(pady=(0, 20))

# --- Password Length ---
frame_length = tk.Frame(root, bg="#F4F6F8")
frame_length.pack(pady=5)
tk.Label(frame_length, text="Password Length:", font=("Helvetica", 12), bg="#F4F6F8", fg="#2C3E50").grid(row=0, column=0, padx=10)
length_var = tk.StringVar(value="12")
length_entry = ttk.Entry(frame_length, textvariable=length_var, width=6)
length_entry.grid(row=0, column=1, padx=5)

# --- Character Options ---
options_frame = tk.LabelFrame(root, text="Character Options", font=("Helvetica", 12, "bold"), bg="#F4F6F8", fg="#2C3E50", padx=20, pady=10)
options_frame.pack(pady=10)

use_lowercase = tk.BooleanVar(value=True)
use_uppercase = tk.BooleanVar(value=True)
use_digits = tk.BooleanVar(value=True)
use_special = tk.BooleanVar(value=False)

ttk.Checkbutton(options_frame, text="Lowercase (a-z)", variable=use_lowercase).pack(anchor="w", pady=3)
ttk.Checkbutton(options_frame, text="Uppercase (A-Z)", variable=use_uppercase).pack(anchor="w", pady=3)
ttk.Checkbutton(options_frame, text="Digits (0-9)", variable=use_digits).pack(anchor="w", pady=3)
ttk.Checkbutton(options_frame, text="Special Characters (!@#...)", variable=use_special).pack(anchor="w", pady=3)

# --- Password Display ---
password_var = tk.StringVar()
password_entry = ttk.Entry(root, textvariable=password_var, font=("Helvetica", 13), width=40)
password_entry.pack(pady=20)

# --- Strength Section ---
strength_var = tk.StringVar(value="Not Checked")
strength_frame = tk.Frame(root, bg="#F4F6F8")
strength_frame.pack(pady=5)
tk.Label(strength_frame, text="Password Strength:", font=("Helvetica", 12, "bold"), bg="#F4F6F8", fg="#2C3E50").grid(row=0, column=0, padx=10)
tk.Label(strength_frame, textvariable=strength_var, font=("Helvetica", 12), fg="#27AE60", bg="#F4F6F8").grid(row=0, column=1)

# --- Buttons ---
btn_frame = tk.Frame(root, bg="#F4F6F8")
btn_frame.pack(pady=20)
ttk.Button(btn_frame, text="Generate Password", command=generate_password).grid(row=0, column=0, padx=10)
ttk.Button(btn_frame, text="Copy to Clipboard", command=copy_to_clipboard).grid(row=0, column=1, padx=10)

# --- Developer Signature ---
dev_label = tk.Label(root, text="Developed by Jogi Naidu", font=("Helvetica", 10, "italic"), fg="#7F8C8D", bg="#F4F6F8")
dev_label.pack(side="bottom", pady=15)

root.mainloop()
