// 共通コンポーネントを読み込む関数
function loadComponents() {
    // ヘッダーを読み込み
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // 現在のページに応じてアクティブなメニューを設定
            setActiveMenu();
            // ヘッダーのイベントリスナーを設定
            setupHeaderEvents();
        })
        .catch(error => console.error('ヘッダーの読み込みに失敗しました:', error));

    // フッターを読み込み
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('フッターの読み込みに失敗しました:', error));
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
