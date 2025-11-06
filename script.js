// 基本的なJavaScript機能

document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの機能は load-components.js で処理されます
    
    // スムーススクロール機能
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // スクロール時のヘッダー効果（背景は常に透明のまま）
    // ヘッダーの背景は透明のため、スクロール時の背景変更は無効化
    
    // アニメーション効果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animatedElements = document.querySelectorAll('.feature-card, .content-card, .quiz-option, .activity-card, .philosophy-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ヒーロー画像の軽いホバー効果（写真用）
    const heroImg = document.querySelector('.hero-cat-image');
    if (heroImg) {
        heroImg.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        heroImg.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // ボタンのホバー効果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // カードのホバー効果
    const cards = document.querySelectorAll('.feature-card, .content-card, .quiz-option, .activity-card, .philosophy-item, .support-way');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        });
    });
    
    // 学習コンテンツページの目次機能
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // アクティブなリンクを更新
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // スムーススクロール
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 現在のセクションをハイライト
    const sections = document.querySelectorAll('.learning-section');
    const updateActiveSection = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveSection);
    
    // ページ読み込み時のアニメーション
    const pageElements = document.querySelectorAll('.hero-content, .features, .learning-preview, .quiz-section');
    pageElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 星のアニメーション
    const stars = document.querySelectorAll('.stars span');
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'twinkle 2s ease-in-out infinite';
            }, 10);
        });
    });
    
    // レスポンシブメニューの改善
    // レスポンシブは CSS 側で処理するため、ここでは表示切替を行わない
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (/* e */) => {
        // no-op: CSS handles layout/responsiveness and animations
    };
    mediaQuery.addListener(handleMediaChange);
    handleMediaChange(mediaQuery);
    
    // パフォーマンス最適化：画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // エラーハンドリング
    window.addEventListener('error', function(e) {
        console.log('エラーが発生しました:', e.error);
    });
    
    // コンソールメッセージ
    console.log('🐱 しあわせねこ塾へようこそ！');
    console.log('動物愛護について学んで、一緒に猫たちを幸せにしましょう！');
    
    // スクロールトップボタンの機能
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        // スクロール位置に応じてボタンを表示/非表示
        function toggleScrollTopButton() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
        
        // スクロールイベント
        window.addEventListener('scroll', toggleScrollTopButton);
        
        // 初期状態をチェック
        toggleScrollTopButton();
        
        // クリックでページトップにスクロール
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ユーティリティ関数
const utils = {
    // デバウンス関数
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // スロットル関数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 要素が画面内にあるかチェック
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// グローバルに公開
window.utils = utils;

// ヘッダーは常に表示する（スクロールで隠さない）
// 以前のスクロールでの hide/show ロジックは無効化しました。
// もし将来、再び自動表示/非表示を入れる場合はここに安全な実装を追加してください。
