// 共通コンポーネントを読み込む関数
function loadComponents() {
    // すぐに読み込み状態クラスを付与して視覚的なジャンプを抑える
    document.body.classList.add('components-loading');

    // 軽いプレースホルダを先に入れてレイアウトのジャンプを緩和
    const headerPH = document.getElementById('header-placeholder');
    const footerPH = document.getElementById('footer-placeholder');
    if (headerPH) {
        headerPH.innerHTML = '<div class="header-skeleton" aria-hidden="true" style="height:72px;"></div>';
    }
    if (footerPH) {
        footerPH.innerHTML = '<div class="footer-skeleton" aria-hidden="true" style="height:120px;"></div>';
    }

    // 両方のfetchが完了したら読み込み状態を解除してアニメーションを開始
    const headerFetch = fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // 現在のページに応じてアクティブなメニューを設定
            setActiveMenu();
            // ヘッダーのイベントリスナーを設定
            setupHeaderEvents();
        })
        .catch(error => console.error('ヘッダーの読み込みに失敗しました:', error));

    const footerFetch = fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('フッターの読み込みに失敗しました:', error));

    // 両方完了 (またはタイムアウト) で ready にする
    const done = Promise.all([headerFetch.catch(() => {}), footerFetch.catch(() => {})]);

    // 安全のためのタイムアウト: 2秒後に強制的に ready にする
    const timeout = new Promise(resolve => setTimeout(resolve, 2000));

    Promise.race([done, timeout]).then(() => {
        // アニメーション用のクラスを付与（読み込み完了後）
        document.body.classList.add('components-animate');
        
        // 1.5秒かけて段階的にアニメーション
        setTimeout(() => {
            document.body.classList.remove('components-loading');
            document.body.classList.add('components-ready');
            
            // コンテンツを段階的に表示
            const elements = document.querySelectorAll('.hero-content, .features, .learning-preview, .quiz-section, .about-section, .activities-section');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('element-visible');
                }, index * 150); // 各要素を150msずつ遅延表示
            });
            
            // スケルトンを最後に消す
            setTimeout(() => {
                const s = document.querySelectorAll('.header-skeleton, .footer-skeleton');
                s.forEach(el => el && el.remove());
            }, 1500);
        }, 100);
    });
}

// 現在のページに応じてアクティブなメニューを設定
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ヘッダーのイベントリスナーを設定
function setupHeaderEvents() {
    // ハンバーガーメニューの機能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        let overlayEl = null;

        const createOverlay = () => {
            overlayEl = document.createElement('div');
            overlayEl.className = 'menu-overlay';
            overlayEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
            document.body.appendChild(overlayEl);
        };

        const removeOverlay = () => {
            if (overlayEl) {
                overlayEl.remove();
                overlayEl = null;
            }
        };

        const closeMenu = () => {
            // 軽いクローズアニメーションをメニューに与える
            document.body.classList.add('menu-closing');
            navMenu.classList.add('closing');

            // オーバーレイ除去はすぐ行う
            removeOverlay();

            // アニメーションが終わったら実際に inactive にする
            setTimeout(() => {
                navMenu.classList.remove('active');
                navMenu.classList.remove('closing');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
                // menu-closing を外して通常のトランジションに戻す
                document.body.classList.remove('menu-closing');
            }, 200);
        };

        const toggleMenu = () => {
            const willOpen = !navMenu.classList.contains('active');
            if (willOpen) {
                // 開くときは closing を確実に外しておく
                navMenu.classList.remove('closing');
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                document.body.classList.add('menu-open');
                hamburger.setAttribute('aria-expanded', 'true');
                createOverlay();
            } else {
                closeMenu();
            }
        };

        hamburger.addEventListener('click', toggleMenu);
        // キーボード操作（Enter / Space）で開閉できるようにする
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // メニュー内のリンクをタップしたら自動で閉じる
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                closeMenu();
            });
        });
    }
}

// ページ読み込み時にコンポーネントを読み込み
document.addEventListener('DOMContentLoaded', loadComponents);
