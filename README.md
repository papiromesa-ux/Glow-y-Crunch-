<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>料理事務管理 — Sistema de Gestión</title>

    <!-- Firebase SDKs -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
        import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAsgV2Wwu97gIiOe5aIMfJ7U-p01GYLGOs",
            authDomain: "ftdr-61eb7.firebaseapp.com",
            projectId: "ftdr-61eb7",
            storageBucket: "ftdr-61eb7.firebasestorage.app",
            messagingSenderId: "1014103741073",
            appId: "1:1014103741073:web:4753fc3c56fd3b8dc6e530",
            measurementId: "G-7FJ5N0MZB8"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);

        window.firebaseApp = app;
        window.firebaseDb = db;
        window.firebaseStorage = storage;
        window.firebaseDoc = doc;
        window.firebaseGetDoc = getDoc;
        window.firebaseSetDoc = setDoc;
        window.firebaseServerTimestamp = serverTimestamp;
        window.firebaseRef = ref;
        window.firebaseUploadBytes = uploadBytes;
        window.firebaseGetDownloadURL = getDownloadURL;
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #0D0A08;
            --bg-card: #1A1410;
            --bg-card-hover: #241C15;
            --red-vermilion: #C41E3A;
            --red-dark: #8B0000;
            --red-crimson: #DC143C;
            --gold: #D4A017;
            --gold-light: #E8C96A;
            --gold-pale: #C9A96E;
            --cream: #F5F0E8;
            --cream-dim: #D4C5A9;
            --text-muted: #A89880;
            --shadow-gold: 0 0 30px rgba(212, 160, 23, 0.15);
            --shadow-red: 0 0 30px rgba(196, 30, 58, 0.2);
            --border-gold: 2px solid var(--gold);
            --border-red: 2px solid var(--red-vermilion);
            --font-jp: 'Shippori Mincho', serif;
            --font-sans: 'Noto Sans JP', sans-serif;
            --font-display: 'Cormorant Garamond', serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: var(--bg-dark);
            color: var(--cream);
            font-family: var(--font-sans);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
            background-image:
                radial-gradient(ellipse at 20% 20%, rgba(196, 30, 58, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(212, 160, 23, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 50%, rgba(26, 20, 16, 0.4) 0%, transparent 100%);
        }

        /* ── SEIGAIHA WAVE PATTERN (bottom) ── */
        body::after {
            content: '';
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 140px;
            background:
                radial-gradient(circle at 20px 20px, var(--gold) 2px, transparent 3px),
                radial-gradient(circle at 60px 40px, var(--gold) 2px, transparent 3px),
                radial-gradient(circle at 100px 20px, var(--gold) 2px, transparent 3px),
                radial-gradient(circle at 140px 40px, var(--gold) 2px, transparent 3px),
                radial-gradient(circle at 180px 20px, var(--gold) 2px, transparent 3px);
            background-size: 200px 60px;
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
            mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        }

        /* ── SAKURA PETALS ── */
        .petal-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .petal {
            position: absolute;
            top: -30px;
            font-size: 18px;
            animation: fall linear infinite;
            opacity: 0.7;
            user-select: none;
            will-change: transform;
        }
        @keyframes fall {
            0% {
                transform: translateY(-5vh) translateX(0) rotate(0deg) scale(1);
                opacity: 0.8;
            }
            25% {
                transform: translateY(25vh) translateX(30px) rotate(90deg) scale(0.9);
                opacity: 0.7;
            }
            50% {
                transform: translateY(50vh) translateX(-20px) rotate(180deg) scale(1.05);
                opacity: 0.6;
            }
            75% {
                transform: translateY(75vh) translateX(40px) rotate(270deg) scale(0.95);
                opacity: 0.5;
            }
            100% {
                transform: translateY(110vh) translateX(-10px) rotate(360deg) scale(0.85);
                opacity: 0.2;
            }
        }

        /* ── TORII GATE DECORATION ── */
        .torii-gate {
            position: fixed;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            pointer-events: none;
            opacity: 0.12;
            font-size: 120px;
            line-height: 1;
            user-select: none;
            letter-spacing: -10px;
            color: var(--red-vermilion);
            text-shadow: 0 0 60px rgba(196, 30, 58, 0.5);
        }

        /* ── MAIN CONTAINER ── */
        .main-container {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ── HEADER ── */
        .header {
            text-align: center;
            padding: 30px 20px 20px;
            position: relative;
        }
        .header-kanji {
            font-family: var(--font-jp);
            font-size: 3.2rem;
            font-weight: 800;
            color: var(--gold);
            letter-spacing: 8px;
            text-shadow: 0 0 40px rgba(212, 160, 23, 0.4), 0 4px 20px rgba(0, 0, 0, 0.5);
            margin-bottom: 4px;
            line-height: 1.2;
        }
        .header-subtitle {
            font-family: var(--font-display);
            font-size: 1.6rem;
            font-weight: 600;
            font-style: italic;
            color: var(--cream-dim);
            letter-spacing: 4px;
            margin-bottom: 6px;
        }
        .header-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
        }
        .header-divider .line {
            width: 80px;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--gold), transparent);
        }
        .header-divider .diamond {
            width: 10px;
            height: 10px;
            background: var(--gold);
            transform: rotate(45deg);
            box-shadow: 0 0 15px rgba(212, 160, 23, 0.5);
        }
        .header-lanterns {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 12px;
            font-size: 2.2rem;
            filter: drop-shadow(0 0 20px rgba(255, 100, 50, 0.4));
            animation: lanternGlow 3s ease-in-out infinite;
        }
        @keyframes lanternGlow {
            0%,
            100% {
                filter: drop-shadow(0 0 15px rgba(255, 100, 50, 0.3));
            }
            50% {
                filter: drop-shadow(0 0 35px rgba(255, 100, 50, 0.7));
            }
        }

        /* ── VIEWS ── */
        .view {
            display: none;
            animation: fadeIn 0.5s ease forwards;
        }
        .view.active {
            display: block;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ── MAIN GRID (4 cards) ── */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            padding: 20px 0;
            flex: 1;
        }
        .section-card {
            background: linear-gradient(145deg, var(--bg-card), #0F0A07);
            border: 2px solid rgba(212, 160, 23, 0.35);
            border-radius: 18px;
            padding: 30px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        .section-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(145deg, rgba(196, 30, 58, 0.08), transparent 60%);
            pointer-events: none;
            border-radius: 18px;
        }
        .section-card::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 18px;
            border: 2px solid transparent;
            background: linear-gradient(145deg, var(--gold), transparent, var(--red-vermilion)) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.4s;
            pointer-events: none;
        }
        .section-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--gold);
            box-shadow: var(--shadow-gold), 0 15px 40px rgba(0, 0, 0, 0.5);
            background: linear-gradient(145deg, var(--bg-card-hover), #1A1008);
        }
        .section-card:hover::after {
            opacity: 1;
        }
        .section-card .card-icon {
            font-size: 3.5rem;
            margin-bottom: 12px;
            filter: drop-shadow(0 4px 15px rgba(212, 160, 23, 0.3));
            position: relative;
            z-index: 1;
        }
        .section-card .card-kanji {
            font-family: var(--font-jp);
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--red-vermilion);
            letter-spacing: 4px;
            margin-bottom: 6px;
            position: relative;
            z-index: 1;
            text-shadow: 0 0 20px rgba(196, 30, 58, 0.3);
        }
        .section-card .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--cream);
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
        }
        .section-card .card-count {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-top: 8px;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }

        /* ── ITEMS LIST VIEW ── */
        .items-view {
            padding: 10px 0 30px;
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: 1px solid rgba(212, 160, 23, 0.4);
            color: var(--gold);
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            letter-spacing: 1px;
            transition: all 0.3s;
            margin-bottom: 20px;
        }
        .back-btn:hover {
            background: rgba(212, 160, 23, 0.1);
            border-color: var(--gold);
            box-shadow: 0 0 20px rgba(212, 160, 23, 0.2);
        }
        .items-title {
            font-family: var(--font-jp);
            font-size: 2rem;
            color: var(--gold);
            text-align: center;
            margin-bottom: 8px;
            letter-spacing: 3px;
        }
        .items-subtitle {
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
            letter-spacing: 2px;
            margin-bottom: 25px;
        }
        .items-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 700px;
            margin: 0 auto;
        }
        .item-row {
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(26, 20, 16, 0.7);
            border: 1px solid rgba(212, 160, 23, 0.25);
            border-radius: 12px;
            padding: 16px 20px;
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(5px);
        }
        .item-row:hover {
            border-color: var(--gold);
            background: rgba(36, 28, 21, 0.85);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: translateX(6px);
        }
        .item-row .item-number {
            font-family: var(--font-jp);
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--red-vermilion);
            min-width: 35px;
            text-align: center;
        }
        .item-row .item-name {
            font-size: 1.05rem;
            color: var(--cream);
            letter-spacing: 0.5px;
            flex: 1;
        }
        .item-row .item-arrow {
            color: var(--gold);
            font-size: 1.2rem;
            transition: transform 0.3s;
        }
        .item-row:hover .item-arrow {
            transform: translateX(5px);
        }

        /* ── DETAIL VIEW ── */
        .detail-view {
            max-width: 750px;
            margin: 0 auto;
            padding: 10px 0 30px;
            text-align: center;
        }
        .detail-kanji {
            font-family: var(--font-jp);
            font-size: 2.8rem;
            color: var(--red-vermilion);
            letter-spacing: 6px;
            margin-bottom: 4px;
            text-shadow: 0 0 30px rgba(196, 30, 58, 0.4);
        }
        .detail-title {
            font-family: var(--font-display);
            font-size: 1.9rem;
            font-weight: 600;
            color: var(--gold);
            letter-spacing: 2px;
            margin-bottom: 6px;
        }
        .detail-divider {
            width: 120px;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--gold), transparent);
            margin: 10px auto 20px;
        }
        .detail-description {
            font-size: 1rem;
            color: var(--cream-dim);
            line-height: 1.7;
            letter-spacing: 0.5px;
            max-width: 600px;
            margin: 0 auto 25px;
            padding: 15px 20px;
            background: rgba(26, 20, 16, 0.5);
            border-radius: 10px;
            border-left: 3px solid var(--red-vermilion);
            text-align: left;
        }

        /* ── IMAGE UPLOAD AREA ── */
        .image-area {
            margin: 15px auto 25px;
            max-width: 450px;
            position: relative;
        }
        .image-placeholder {
            width: 100%;
            aspect-ratio: 16/10;
            background: rgba(26, 20, 16, 0.6);
            border: 2px dashed rgba(212, 160, 23, 0.4);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.4s;
            position: relative;
            overflow: hidden;
        }
        .image-placeholder:hover {
            border-color: var(--gold);
            background: rgba(36, 28, 21, 0.7);
            box-shadow: var(--shadow-gold);
        }
        .image-placeholder .upload-icon {
            font-size: 3rem;
            color: var(--gold);
            opacity: 0.7;
        }
        .image-placeholder .upload-text {
            color: var(--text-muted);
            font-size: 0.9rem;
            letter-spacing: 1px;
        }
        .image-placeholder img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 14px;
            animation: imageReveal 0.6s ease;
        }
        @keyframes imageReveal {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .image-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--gold);
            font-size: 1rem;
            letter-spacing: 2px;
            animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
            0%,
            100% {
                opacity: 0.4;
            }
            50% {
                opacity: 1;
            }
        }
        .image-badge {
            display: inline-block;
            background: rgba(196, 30, 58, 0.2);
            border: 1px solid var(--red-vermilion);
            color: var(--red-vermilion);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            letter-spacing: 2px;
            margin-top: 8px;
        }

        /* ── SUMMARY BOX ── */
        .summary-box {
            background: linear-gradient(145deg, rgba(26, 20, 16, 0.8), rgba(15, 10, 7, 0.9));
            border: 1px solid rgba(212, 160, 23, 0.3);
            border-radius: 14px;
            padding: 20px 25px;
            margin-top: 15px;
            text-align: left;
            position: relative;
            overflow: hidden;
        }
        .summary-box::before {
            content: '📋';
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2rem;
            opacity: 0.3;
        }
        .summary-box h4 {
            font-family: var(--font-jp);
            color: var(--gold);
            font-size: 1.1rem;
            letter-spacing: 2px;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(212, 160, 23, 0.2);
            padding-bottom: 8px;
        }
        .summary-box p {
            color: var(--cream-dim);
            font-size: 0.9rem;
            line-height: 1.6;
            letter-spacing: 0.3px;
        }

        /* ── FILE INPUT (hidden) ── */
        .hidden-input {
            display: none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
            .header-kanji {
                font-size: 2rem;
                letter-spacing: 4px;
            }
            .header-subtitle {
                font-size: 1.2rem;
                letter-spacing: 2px;
            }
            .cards-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .section-card {
                padding: 22px 15px;
            }
            .section-card .card-icon {
                font-size: 2.5rem;
            }
            .items-title {
                font-size: 1.5rem;
            }
            .detail-kanji {
                font-size: 2rem;
                letter-spacing: 3px;
            }
            .detail-title {
                font-size: 1.4rem;
            }
            .torii-gate {
                font-size: 70px;
            }
        }
        @media (max-width: 480px) {
            .header-kanji {
                font-size: 1.6rem;
                letter-spacing: 3px;
            }
            .header-subtitle {
                font-size: 1rem;
            }
            .header-lanterns {
                gap: 20px;
                font-size: 1.6rem;
            }
            .item-row {
                padding: 12px 14px;
                gap: 10px;
            }
            .item-row .item-name {
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>

    <!-- ═══ TORII GATE ═══ -->
    <div class="torii-gate">⛩️</div>

    <!-- ═══ SAKURA PETALS ═══ -->
    <div class="petal-container" id="petalContainer"></div>

    <!-- ═══ MAIN ═══ -->
    <div class="main-container">

        <!-- HEADER -->
        <header class="header">
            <div class="header-kanji">料理事務管理</div>
            <div class="header-subtitle">Sistema de Gestión Documental</div>
            <div class="header-divider">
                <div class="line"></div>
                <div class="diamond"></div>
                <div class="line"></div>
            </div>
            <div class="header-lanterns">
                <span>🏮</span>
                <span>🏮</span>
                <span>🏮</span>
            </div>
        </header>

        <!-- ═══ VIEW: MAIN (4 CARDS) ═══ -->
        <div class="view active" id="view-main">
            <div class="cards-grid">
                <!-- Sala/Servicio -->
                <div class="section-card" onclick="showItems('sala')">
                    <div class="card-icon">🏮</div>
                    <div class="card-kanji">客室</div>
                    <div class="card-title">Sala / Servicio</div>
                    <div class="card-count">5 fichas</div>
                </div>
                <!-- Cocina -->
                <div class="section-card" onclick="showItems('cocina')">
                    <div class="card-icon">🍳</div>
                    <div class="card-kanji">厨房</div>
                    <div class="card-title">Cocina</div>
                    <div class="card-count">5 fichas</div>
                </div>
                <!-- Almacén -->
                <div class="section-card" onclick="showItems('almacen')">
                    <div class="card-icon">📦</div>
                    <div class="card-kanji">倉庫</div>
                    <div class="card-title">Almacén / Compras</div>
                    <div class="card-count">5 fichas</div>
                </div>
                <!-- Administración -->
                <div class="section-card" onclick="showItems('admin')">
                    <div class="card-icon">📊</div>
                    <div class="card-kanji">管理</div>
                    <div class="card-title">Administración</div>
                    <div class="card-count">5 fichas</div>
                </div>
            </div>
        </div>

        <!-- ═══ VIEW: ITEMS LIST ═══ -->
        <div class="view" id="view-items">
            <button class="back-btn" onclick="showMain()">← Volver</button>
            <div class="items-title" id="itemsTitle"></div>
            <div class="items-subtitle" id="itemsSubtitle"></div>
            <div class="items-list" id="itemsList"></div>
        </div>

        <!-- ═══ VIEW: DETAIL ═══ -->
        <div class="view" id="view-detail">
            <button class="back-btn" onclick="showItemsFromDetail()">← Volver a la lista</button>
            <div class="detail-view">
                <div class="detail-kanji" id="detailKanji"></div>
                <div class="detail-title" id="detailTitle"></div>
                <div class="detail-divider"></div>
                <div class="detail-description" id="detailDescription"></div>

                <!-- Image Upload Area -->
                <div class="image-area" id="imageArea">
                    <div class="image-placeholder" id="imagePlaceholder" onclick="triggerUpload()">
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">Tocar para subir imagen</div>
                        <div class="upload-text" style="font-size:0.7rem;opacity:0.6;">(Firebase Storage)</div>
                    </div>
                    <input type="file" class="hidden-input" id="fileInput" accept="image/*" onchange="handleImageUpload(event)">
                    <div class="image-badge">🏮 永続 — La imagen no se podrá eliminar</div>
                </div>

                <!-- Summary Box -->
                <div class="summary-box">
                    <h4>📋 Resumen</h4>
                    <p id="detailSummary"></p>
                </div>
            </div>
        </div>

    </div>

    <!-- ═══ JAVASCRIPT ═══ -->
    <script>
        // ─── DATA ───
        const sectionsData = {
            sala: {
                name: 'Sala / Servicio',
                kanji: '客室',
                icon: '🏮',
                items: [
                    { id: 'comanda', name: 'Comanda (cocina/barra/caja)', kanji: '注文',
                        desc: 'Documento esencial para registrar los pedidos de los comensales. Circula entre la sala, la barra y la cocina. Debe incluir número de mesa, camarero asignado, hora de emisión, y detalle de cada plato o bebida solicitada.',
                        summary: 'La comanda es el hilo conductor entre el servicio de sala y la producción en cocina. Su correcto uso evita errores en los pedidos, agiliza el servicio y permite un control preciso del consumo. Debe ser clara, numerada y con copia para cada área.' },
                    { id: 'reservas', name: 'Hoja de reservas', kanji: '予約',
                        desc: 'Registro de todas las reservas del servicio. Contiene: nombre del cliente, número de comensales, hora de llegada, mesa asignada, teléfono de contacto, y observaciones especiales (alergias, celebraciones, accesibilidad).',
                        summary: 'La hoja de reservas permite planificar el servicio con antelación, optimizar la distribución de mesas y ofrecer una experiencia personalizada. Es clave para gestionar la ocupación y evitar overbooking.' },
                    { id: 'plano_mesas', name: 'Plano de distribución de mesas', kanji: '座席',
                        desc: 'Representación gráfica del salón con la ubicación de cada mesa, numeración y capacidad. Permite asignar mesas a reservas, controlar la disponibilidad en tiempo real y organizar el flujo de servicio.',
                        summary: 'El plano de mesas es una herramienta estratégica para maximizar la ocupación sin saturar al equipo. Facilita la comunicación entre recepción, sala y cocina, y asegura que cada comensal tenga una experiencia cómoda.' },
                    { id: 'alergenos', name: 'Ficha de alérgenos por comensal', kanji: '注意',
                        desc: 'Formulario que registra las alergias e intolerancias alimentarias de cada comensal. Debe estar vinculado a la reserva o comanda y visible para todo el personal de cocina y sala.',
                        summary: 'La gestión de alérgenos es crítica para la seguridad alimentaria. Esta ficha garantiza que la cocina adapte los platos según las necesidades del cliente, evitando riesgos graves y cumpliendo con la normativa sanitaria.' },
                    { id: 'beo', name: 'BEO (Parte de banquetes y eventos)', kanji: '宴会',
                        desc: 'Documento que detalla todos los aspectos de un evento o banquete: número de invitados, menú, horarios, disposición de la sala, personal asignado, equipamiento necesario y condiciones de pago.',
                        summary: 'El BEO (Banquet Event Order) es el contrato interno que coordina todos los departamentos involucrados en un evento. Garantiza que cada detalle esté planificado y que no haya sorpresas de última hora.' }
                ]
            },
            cocina: {
                name: 'Cocina',
                kanji: '厨房',
                icon: '🍳',
                items: [
                    { id: 'ficha_tecnica', name: 'Ficha técnica de plato', kanji: '料理',
                        desc: 'Documento que detalla cada receta: ingredientes con cantidades exactas, método de elaboración, presentación, coste de materia prima, precio de venta, y margen de beneficio.',
                        summary: 'La ficha técnica es la base de la estandarización culinaria. Permite mantener la consistencia de los platos, controlar los costes, capacitar al personal nuevo y asegurar la rentabilidad del menú.' },
                    { id: 'appcc', name: 'Control de temperaturas APPCC/HACCP', kanji: '温度',
                        desc: 'Registro de temperaturas de almacenamiento, cocción, mantenimiento y enfriamiento de alimentos. Incluye hora, temperatura medida, alimento o equipo controlado y firma del responsable.',
                        summary: 'El sistema APPCC (Análisis de Peligros y Puntos de Control Crítico) es obligatorio en hostelería. El control de temperaturas es uno de sus pilares, garantizando que los alimentos se mantienen fuera de la zona de peligro (4°C–60°C).' },
                    { id: 'trazabilidad', name: 'Control de trazabilidad de alimentos', kanji: '追跡',
                        desc: 'Sistema de registro que permite seguir el recorrido de cada ingrediente desde su origen (proveedor) hasta el plato servido. Incluye lote, fecha de recepción, proveedor y plato en el que se utiliza.',
                        summary: 'La trazabilidad es esencial para poder retirar rápidamente cualquier producto contaminado y cumplir con la legislación sanitaria. También protege al establecimiento ante posibles reclamaciones.' },
                    { id: 'mermas', name: 'Hoja de mermas y desperdicios', kanji: '廃棄',
                        desc: 'Registro de todos los alimentos que se desechan: por caducidad, rotura, error de preparación o desperdicio durante la manipulación. Incluye cantidad, motivo y responsable.',
                        summary: 'El control de mermas es fundamental para la rentabilidad. Permite identificar áreas de mejora en compras, almacenamiento y preparación, reduciendo pérdidas económicas y el desperdicio alimentario.' },
                    { id: 'caducidades', name: 'Control de caducidades (PEPS/FIFO)', kanji: '期限',
                        desc: 'Sistema de rotación de stock basado en el principio PEPS (Primero en Entrar, Primero en Salir). Registro de fechas de caducidad de todos los productos almacenados.',
                        summary: 'La correcta rotación de stock evita que los productos caduquen en el almacén, reduce las mermas y garantiza la frescura de los ingredientes. El método FIFO es una práctica obligatoria en cocina profesional.' }
                ]
            },
            almacen: {
                name: 'Almacén / Compras',
                kanji: '倉庫',
                icon: '📦',
                items: [
                    { id: 'pedido', name: 'Hoja de pedido a proveedores', kanji: '注文',
                        desc: 'Documento que formaliza la solicitud de mercancía a los proveedores. Incluye: fecha, proveedor, productos solicitados con cantidades y precios acordados, y fecha de entrega prevista.',
                        summary: 'La hoja de pedido es el punto de partida de la cadena de suministro. Un pedido bien estructurado evita faltas de stock, sobrecompras y discrepancias con los proveedores.' },
                    { id: 'albaran', name: 'Albarán de recepción de mercancía', kanji: '受領',
                        desc: 'Documento que acredita la recepción de la mercancía. Se verifica que las cantidades y calidades coincidan con el pedido, y se registran posibles incidencias (roturas, faltas, productos en mal estado).',
                        summary: 'El albarán es la prueba documental de la entrega. Su correcta gestión permite reclamar a proveedores ante incidencias y mantener el control del inventario actualizado.' },
                    { id: 'inventario', name: 'Control de stock e inventario', kanji: '在庫',
                        desc: 'Registro actualizado de todos los productos almacenados: cantidades, ubicación, valor económico y rotación. Se realiza periódicamente (diario, semanal o mensual).',
                        summary: 'El control de inventario es clave para la gestión económica del establecimiento. Permite conocer el valor del stock, detectar robos o pérdidas y optimizar las compras.' },
                    { id: 'temp_camaras', name: 'Control de temperatura de cámaras', kanji: '冷蔵',
                        desc: 'Registro de las temperaturas de cámaras frigoríficas y congeladores. Se realiza al menos 2-3 veces al día y se anotan las mediciones con hora y responsable.',
                        summary: 'El control de temperatura de cámaras es un punto crítico del sistema APPCC. Un fallo en la refrigeración puede arruinar todo el stock y suponer un grave riesgo sanitario.' },
                    { id: 'rotacion', name: 'Control de rotación de stock (FIFO)', kanji: '回転',
                        desc: 'Sistema de gestión que prioriza el uso de los productos con fecha de caducidad más próxima. Implica etiquetar los productos con fecha de entrada y colocarlos de forma accesible.',
                        summary: 'El método FIFO (First In, First Out) reduce drásticamente las pérdidas por caducidad, mantiene la calidad de los productos y asegura una gestión eficiente del almacén.' }
                ]
            },
            admin: {
                name: 'Administración',
                kanji: '管理',
                icon: '📊',
                items: [
                    { id: 'caja_diario', name: 'Control de caja diario', kanji: '金銭',
                        desc: 'Registro de todos los movimientos de efectivo durante el servicio: ventas, ingresos, salidas para pagos, cambios. Se anota cada operación con hora y responsable.',
                        summary: 'El control de caja diario permite conciliar los ingresos reales con las ventas registradas. Es la primera línea de defensa contra errores y fraudes.' },
                    { id: 'arqueo', name: 'Arqueo / Cierre de caja', kanji: '精算',
                        desc: 'Proceso de recuento del efectivo al final del turno. Se compara el efectivo real con las ventas registradas en el sistema y se documenta cualquier diferencia.',
                        summary: 'El arqueo de caja es un procedimiento obligatorio para mantener la integridad financiera. Detecta desviaciones y permite corregir errores antes de que se conviertan en pérdidas.' },
                    { id: 'turnos', name: 'Control de turnos y horarios', kanji: '勤務',
                        desc: 'Planificación de los turnos del personal: horarios de entrada y salida, días libres, vacaciones, sustituciones. Incluye registro de horas trabajadas para nóminas.',
                        summary: 'Una buena gestión de turnos asegura que siempre haya personal suficiente en cada puesto, evita el exceso de horas extras y mejora la satisfacción del equipo.' },
                    { id: 'balance', name: 'Balance diario de ventas', kanji: '売上',
                        desc: 'Resumen de las ventas del día: desglose por categorías (comida, bebida, postres), número de comensales, ticket medio, y comparativa con días anteriores.',
                        summary: 'El balance diario permite analizar el rendimiento del negocio en tiempo real, identificar tendencias y tomar decisiones informadas sobre precios, promociones y personal.' },
                    { id: 'incidencias', name: 'Parte de incidencias', kanji: '事故',
                        desc: 'Documento para registrar cualquier incidente ocurrido durante el servicio: roturas, quejas de clientes, accidentes laborales, fallos de equipamiento, etc.',
                        summary: 'El parte de incidencias es una herramienta de mejora continua. Documenta los problemas para poder analizarlos y evitar que se repitan en el futuro.' }
                ]
            }
        };

        // ─── STATE ───
        let currentSection = null;
        let currentItemId = null;
        let currentSectionId = null;
        let uploadInProgress = false;

        // ─── NAVIGATION ───
        function showView(viewId) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showMain() {
            showView('view-main');
        }

        function showItems(sectionId) {
            currentSectionId = sectionId;
            const section = sectionsData[sectionId];
            document.getElementById('itemsTitle').textContent = section.name;
            document.getElementById('itemsSubtitle').textContent =
                `${section.kanji} — Seleccione una ficha para ver detalles`;

            const listEl = document.getElementById('itemsList');
            listEl.innerHTML = '';
            section.items.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'item-row';
                row.onclick = () => showDetail(sectionId, item.id);
                row.innerHTML = `
                    <span class="item-number">${index + 1}</span>
                    <span class="item-name">${item.name}</span>
                    <span class="item-arrow">→</span>
                `;
                listEl.appendChild(row);
            });

            showView('view-items');
        }

        function showDetail(sectionId, itemId) {
            currentSectionId = sectionId;
            currentItemId = itemId;
            const section = sectionsData[sectionId];
            const item = section.items.find(i => i.id === itemId);

            document.getElementById('detailKanji').textContent = item.kanji;
            document.getElementById('detailTitle').textContent = item.name;
            document.getElementById('detailDescription').textContent = item.desc;
            document.getElementById('detailSummary').textContent = item.summary;

            // Reset image area
            resetImageArea();

            // Load existing image from Firebase
            loadExistingImage(sectionId, itemId);

            showView('view-detail');
        }

        function showItemsFromDetail() {
            if (currentSectionId) {
                showItems(currentSectionId);
            } else {
                showMain();
            }
        }

        // ─── FIREBASE IMAGE OPERATIONS ───
        function getFirebaseDocId(sectionId, itemId) {
            return `${sectionId}_${itemId}`;
        }

        async function loadExistingImage(sectionId, itemId) {
            const placeholder = document.getElementById('imagePlaceholder');
            const docId = getFirebaseDocId(sectionId, itemId);

            try {
                const docRef = window.firebaseDoc(window.firebaseDb, 'fichas', docId);
                const docSnap = await window.firebaseGetDoc(docRef);

                if (docSnap.exists() && docSnap.data().imageUrl) {
                    const url = docSnap.data().imageUrl;
                    placeholder.innerHTML = `<img src="${url}" alt="Imagen de la ficha" onload="this.style.opacity='1'">`;
                } else {
                    resetImageArea();
                }
            } catch (error) {
                console.error('Error al cargar la imagen:', error);
                resetImageArea();
            }
        }

        function resetImageArea() {
            const placeholder = document.getElementById('imagePlaceholder');
            if (!uploadInProgress) {
                placeholder.innerHTML = `
                    <div class="upload-icon">📷</div>
                    <div class="upload-text">Tocar para subir imagen</div>
                    <div class="upload-text" style="font-size:0.7rem;opacity:0.6;">(Firebase Storage)</div>
                `;
            }
            document.getElementById('fileInput').value = '';
        }

        function triggerUpload() {
            if (uploadInProgress) return;
            document.getElementById('fileInput').click();
        }

        async function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                alert('Por favor, sube una imagen válida (JPEG, PNG, WebP, GIF o BMP).');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen es demasiado grande. Máximo 5MB.');
                return;
            }

            if (!currentSectionId || !currentItemId) return;

            uploadInProgress = true;
            const placeholder = document.getElementById('imagePlaceholder');
            placeholder.innerHTML = `
                <div class="image-loading">⏳ Subiendo imagen...</div>
            `;

            const docId = getFirebaseDocId(currentSectionId, currentItemId);
            const storagePath = `fichas/${docId}_${Date.now()}.${file.type.split('/')[1] || 'jpg'}`;

            try {
                // Upload to Firebase Storage
                const storageRef = window.firebaseRef(window.firebaseStorage, storagePath);
                await window.firebaseUploadBytes(storageRef, file);

                // Get download URL
                const downloadURL = await window.firebaseGetDownloadURL(storageRef);

                // Save URL to Firestore
                const docRef = window.firebaseDoc(window.firebaseDb, 'fichas', docId);
                await window.firebaseSetDoc(docRef, {
                    imageUrl: downloadURL,
                    updatedAt: window.firebaseServerTimestamp(),
                    fileName: file.name,
                    fileSize: file.size,
                    sectionId: currentSectionId,
                    itemId: currentItemId
                }, { merge: true });

                // Display the uploaded image
                placeholder.innerHTML = `<img src="${downloadURL}" alt="Imagen de la ficha">`;

            } catch (error) {
                console.error('Error al subir la imagen:', error);
                alert('Error al subir la imagen. Revisa la consola para más detalles.');
                resetImageArea();
            } finally {
                uploadInProgress = false;
            }
        }

        // ─── CREATE SAKURA PETALS ───
        function createPetals() {
            const container = document.getElementById('petalContainer');
            const petalEmojis = ['🌸', '🌺', '💮', '🍃'];
            for (let i = 0; i < 22; i++) {
                const petal = document.createElement('span');
                petal.className = 'petal';
                petal.textContent = petalEmojis[i % petalEmojis.length];
                petal.style.left = `${Math.random() * 100}%`;
                petal.style.fontSize = `${Math.random() * 14 + 10}px`;
                petal.style.animationDuration = `${Math.random() * 8 + 7}s`;
                petal.style.animationDelay = `${Math.random() * 12}s`;
                petal.style.opacity = Math.random() * 0.5 + 0.3;
                container.appendChild(petal);
            }
        }

        // ─── INIT ───
        document.addEventListener('DOMContentLoaded', () => {
            createPetals();
            showMain();
        });
    </script>
</body>
</html>
