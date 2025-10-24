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

    // 安全のためのタイムアウト: 2.5 秒後に強制的に ready にする
    const timeout = new Promise(resolve => setTimeout(resolve, 2500));

    Promise.race([done, timeout]).then(() => {
        // 読み込みクラスを切り替えてトランジションを発火
        document.body.classList.remove('components-loading');
        document.body.classList.add('components-ready');
        // 少ししてスケルトンを消す（あれば）
        setTimeout(() => {
            const s = document.querySelectorAll('.header-skeleton, .footer-skeleton');
            s.forEach(el => el && el.remove());
        }, 350);
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
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        };
        hamburger.addEventListener('click', toggleMenu);
        // メニュー内のリンクをタップしたら自動で閉じる
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ページ読み込み時にコンポーネントを読み込み
document.addEventListener('DOMContentLoaded', loadComponents);
