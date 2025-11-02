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
                // ローカルのデータファイルがあれば読み込んでページを動的に更新
                if (typeof loadSiteData === 'function') {
                    try { loadSiteData(); } catch (e) { console.warn('loadSiteData error', e); }
                }
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

// data/site.yml を簡易パースしてページの主要テキストを差し替える（軽量な実装）
function loadSiteData() {
    fetch('data/site.yml')
        .then(r => { if (!r.ok) throw new Error('no site data'); return r.text(); })
        .then(text => {
            // シンプルな YAML パーサ（限定的）：トップレベルの key: value と block scalar | を扱う
            const result = {};
            const lines = text.split(/\r?\n/);
            let i = 0;
            while (i < lines.length) {
                const line = lines[i];
                const m = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)$/);
                if (m) {
                    const key = m[1];
                    let rest = m[2] || '';
                    if (rest === '|') {
                        // block scalar
                        i++;
                        const buf = [];
                        while (i < lines.length && /^\s/.test(lines[i])) {
                            buf.push(lines[i].replace(/^\s{0,4}/, ''));
                            i++;
                        }
                        result[key] = buf.join('\n').trim();
                        continue; // already advanced i
                    } else {
                        // plain scalar (possibly quoted)
                        rest = rest.replace(/^"|"$/g, '');
                        result[key] = rest;
                    }
                }
                i++;
            }

            // ヒーロー差し替え
            const hero = document.querySelector('.hero-content');
            if (hero) {
                if (result.hero_title) {
                    const h2 = hero.querySelector('h2');
                    if (h2) h2.innerHTML = result.hero_title.replace(/\n/g, '<br>');
                }
                if (result.hero_text) {
                    const p = hero.querySelector('p');
                    if (p) p.textContent = result.hero_text;
                }
                if (result.hero_primary_label) {
                    const a = hero.querySelector('.hero-buttons .btn-primary');
                    if (a) a.textContent = result.hero_primary_label;
                }
                if (result.hero_secondary_label) {
                    const a2 = hero.querySelector('.hero-buttons .btn-secondary');
                    if (a2) a2.textContent = result.hero_secondary_label;
                }
            }

            // 特徴セクション差し替え（簡易）
            if (Array.isArray(result.features)) {
                // 既存の features-grid を上書き
                const grid = document.querySelector('.features-grid');
                if (grid) {
                    // build new cards
                    grid.innerHTML = '';
                    result.features.forEach(f => {
                        const card = document.createElement('div');
                        card.className = 'feature-card';
                        card.innerHTML = `\n                            <div class="feature-icon">${escapeHtml(f.icon || '')}</div>\n                            <h4>${escapeHtml(f.title || '')}</h4>\n                            <p>${escapeHtml(f.text || '')}</p>\n                        `;
                        grid.appendChild(card);
                    });
                }
            }
        })
        .catch(() => {
            // data/site.yml がない場合は静的なコンテンツを使う
        });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>\"]+/g, function(s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
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
            // 初期は透明にしてからフェードイン
            overlayEl.style.opacity = '0';
            overlayEl.style.transition = 'opacity 300ms ease';
            overlayEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
            document.body.appendChild(overlayEl);
            // 次のフレームでフェードイン
            requestAnimationFrame(() => {
                if (overlayEl) overlayEl.style.opacity = '1';
            });
        };

        const removeOverlay = () => {
            if (!overlayEl) return;
            // フェードアウトしてから削除
            overlayEl.style.opacity = '0';
            setTimeout(() => {
                if (overlayEl && overlayEl.parentNode) {
                    overlayEl.parentNode.removeChild(overlayEl);
                }
                overlayEl = null;
            }, 320);
        };

        const closeMenu = () => {
            // クローズアニメーションを開始
            document.body.classList.add('menu-closing');
            navMenu.classList.add('closing');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');

            // オーバーレイをフェードアウトして削除（removeOverlay がフェードアウトを扱う）
            removeOverlay();

            // アニメーション完了を待って状態をリセット
            setTimeout(() => {
                navMenu.classList.remove('active', 'closing');
                document.body.classList.remove('menu-open', 'menu-closing');
            }, 320);
        };

        const toggleMenu = () => {
            const willOpen = !navMenu.classList.contains('active');
            
            // スムーズな開閉のために状態をリセット
            navMenu.classList.remove('closing');
            document.body.classList.remove('menu-closing');
            
            if (willOpen) {
                // メニューを開く
                createOverlay();
                requestAnimationFrame(() => {
                    navMenu.classList.add('active');
                    hamburger.classList.add('active');
                    document.body.classList.add('menu-open');
                    hamburger.setAttribute('aria-expanded', 'true');
                });
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
