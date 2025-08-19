from flask import Flask, render_template, request, redirect, url_for, flash
import csv
import os
import hashlib

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'

# Configuración
CSV_FILE = 'usuarios.csv'

def init_csv():
    """Inicializa el archivo CSV si no existe"""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['nombre', 'correo', 'password_hash'])

def hash_password(password):
    """Hashea la contraseña para seguridad"""
    return hashlib.sha256(password.encode()).hexdigest()

def save_user(nombre, correo, password):
    """Guarda usuario en CSV"""
    try:
        password_hash = hash_password(password)
        with open(CSV_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([nombre, correo, password_hash])
        return True
    except Exception as e:
        print(f"Error al guardar usuario: {e}")
        return False

def user_exists(correo):
    """Verifica si el usuario ya existe"""
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['correo'] == correo:
                    return True
        return False
    except FileNotFoundError:
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro', methods=['POST'])
def registro():
    nombre = request.form.get('nombre', '').strip()
    correo = request.form.get('correo', '').strip()
    password = request.form.get('password', '').strip()
    
    # Validaciones básicas
    if not all([nombre, correo, password]):
        flash('Todos los campos son obligatorios', 'error')
        return redirect(url_for('index'))
    
    if len(password) < 6:
        flash('La contraseña debe tener al menos 6 caracteres', 'error')
        return redirect(url_for('index'))
    
    if user_exists(correo):
        flash('Este correo ya está registrado', 'error')
        return redirect(url_for('index'))
    
    # Guardar usuario
    if save_user(nombre, correo, password):
        flash('Usuario registrado exitosamente', 'success')
    else:
        flash('Error al registrar usuario', 'error')
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_csv()
    app.run(debug=True, host='0.0.0.0', port=5000)