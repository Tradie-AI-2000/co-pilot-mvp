import { marketService } from '@/services/market-service';
import { MarketView } from '@/components/market/market-view';
import { NewsFeedWidget } from '@/components/market/news-feed';
import styles from './market.module.css';

export const metadata = {
    title: 'Market Intelligence | Co-Pilot',
    description: 'Golden Triangle Construction Market Intel'
};

export default async function MarketPage() {
    // Parallel fetch for speed
    const [tenders, news] = await Promise.all([
        marketService.getTenders({}),
        marketService.getNewsFeed()
    ]);

    return (
        <div className={styles.marketPage}>
            <header className={styles.pageHeader}>
                <div className={styles.titleArea}>
                    <h1>Market Intelligence</h1>
                    <p className={styles.subtitle}>BCI Central Intel & Construction League Analytics</p>
                </div>
                <div className={styles.controls}>
                    <span className={styles.badge}>Golden Triangle Focus</span>
                </div>
            </header>

            <div className={styles.marketLayout}>
                <main className={styles.mainBoard}>
                    <MarketView tenders={tenders} />
                </main>
                <aside className={styles.sidebarWidget}>
                    <NewsFeedWidget initialNews={news} />
                </aside>
            </div>
        </div>
    );
}
