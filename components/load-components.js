// ヘッダーとフッターを動的に読み込む
(function() {
    'use strict';
    
    // 現在のページのパスを取得
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // ヘッダーを読み込む
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;
        
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('ヘッダーの読み込みに失敗しました');
                }
                return response.text();
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;
                
                // 現在のページに応じてアクティブなメニューを設定
                const navLinks = headerPlaceholder.querySelectorAll('.nav-menu a');
                navLinks.forEach(link => {
                    const linkPath = link.getAttribute('href');
                    if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html')) {
                        link.classList.add('active');
                    }
                });
                
                // ハンバーガーメニューの機能を初期化
                initHamburgerMenu();
                
                // コンポーネント読み込み完了を通知
                document.body.classList.add('components-animate');
                setTimeout(() => {
                    document.body.classList.remove('components-loading');
                    document.body.classList.add('components-ready');
                }, 50);
            })
            .catch(error => {
                console.error('ヘッダーの読み込みエラー:', error);
                // エラー時も表示を続ける
                document.body.classList.remove('components-loading');
                document.body.classList.add('components-ready');
            });
    }
    
    // フッターを読み込む
    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;
        
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('フッターの読み込みに失敗しました');
                }
                return response.text();
            })
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => {
                console.error('フッターの読み込みエラー:', error);
            });
    }
    
    // ハンバーガーメニューの機能
    function initHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (!hamburger || !navMenu) return;
        
        function toggleMenu() {
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                // メニューを閉じる
                navMenu.classList.add('closing');
                body.classList.remove('menu-open');
                
                setTimeout(() => {
                    navMenu.classList.remove('active', 'closing');
                }, 200);
            } else {
                // メニューを開く
                navMenu.classList.add('active');
                body.classList.add('menu-open');
            }
            
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isOpen);
        }
        
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // メニュー内のリンクをクリックしたらメニューを閉じる
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    toggleMenu();
                }, 100);
            }
        });
        
        // メニュー外をタップ/クリックしたらメニューを閉じる
        function closeMenuOnOutsideClick(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            }
        }
        
        // クリックとタッチイベントの両方に対応
        document.addEventListener('click', closeMenuOnOutsideClick, true);
        document.addEventListener('touchend', closeMenuOnOutsideClick, true);
        
        // メニュー背景をクリックしても閉じる
        navMenu.addEventListener('click', function(e) {
            // リンクやリストアイテム以外の場所（メニュー背景）をクリックした場合
            if (e.target === navMenu || 
                (e.target.tagName === 'UL' && !e.target.closest('li')) ||
                (e.target.classList && e.target.classList.contains('nav-menu'))) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            }
        });
        
        // タッチイベントにも対応
        navMenu.addEventListener('touchend', function(e) {
            if (e.target === navMenu || 
                (e.target.tagName === 'UL' && !e.target.closest('li')) ||
                (e.target.classList && e.target.classList.contains('nav-menu'))) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            }
        });
    }
    
    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('components-loading');
            loadHeader();
            loadFooter();
        });
    } else {
        document.body.classList.add('components-loading');
        loadHeader();
        loadFooter();
    }
})();

