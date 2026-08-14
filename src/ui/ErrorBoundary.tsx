/**
 * HATA SINIRI — beyaz ekran yerine kurtarma ekranı
 *
 * En yüksek riskli teknik açık buydu. React'te bir bileşen hata fırlatırsa
 * varsayılan davranış TÜM AĞACI SÖKMEK. Sonuç: bomboş beyaz ekran.
 *
 * Bunun olacağı yer: salonda, seansın ortasında, internetsiz. Kullanıcı
 * ne olduğunu anlamaz, o seansın girdiği sayılar gider, ve büyük ihtimalle
 * uygulamayı bir daha açmaz. Tek satırlık bir hata bir yıllık alışkanlığı
 * kırabilir.
 *
 * Bu bileşenin tek işi o zinciri kesmek:
 *  1. Ekranda ne olduğunu Türkçe söyle
 *  2. VERİYİ KURTAR — yedeği indirme düğmesi en üstte
 *  3. Sekmeyi yenilemeden geri dönmeyi dene
 *
 * Not: hata sınırı yalnızca RENDER sırasındaki hataları yakalar. Olay
 * işleyicilerindeki ve async koddaki hatalar buraya düşmez; onlar için
 * ayrıca window.onerror dinleyicisi var (main.tsx).
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Konsola bas — telefonda görülemez ama masaüstünde hata ayıklanır.
    console.error('[ASCEND] render hatası:', error, info.componentStack);
  }

  /** Ham localStorage'ı indir. State bozuk olabilir, o yüzden parse etmeyiz. */
  private rescue = () => {
    try {
      const raw = localStorage.getItem('ascend.state.v1') ?? '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ascend-kurtarma-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch {
      alert('Veri okunamadı. Tarayıcı verilerini SİLME — yardım iste.');
    }
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{
        maxWidth: 440, margin: '0 auto', padding: '32px 18px',
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 34, marginBottom: 8 }}>⚠</div>
        <h1 style={{ fontSize: 21, fontWeight: 500, margin: '0 0 8px' }}>
          Bir şeyler ters gitti
        </h1>
        <p style={{ color: 'var(--dim)', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
          Uygulama bu ekranı çizerken hata verdi. <b style={{ color: '#e6e8ee' }}>
          Verin duruyor</b> — önce yedeğini al, sonra geri dönmeyi dene.
        </p>

        <button onClick={this.rescue} style={{
          marginTop: 20, height: 52, borderRadius: 12, border: 'none',
          background: '#f5c542', color: '#0b0d12', fontSize: 15.5,
          fontWeight: 700, cursor: 'pointer',
        }}>
          Önce veriyi kurtar (indir)
        </button>

        <button onClick={() => this.setState({ error: null })} style={{
          marginTop: 8, height: 46, borderRadius: 12, cursor: 'pointer',
          border: '1px solid var(--line)', background: 'transparent',
          color: 'var(--txt)', fontSize: 14,
        }}>
          Geri dön
        </button>

        <button onClick={() => window.location.reload()} style={{
          marginTop: 8, height: 46, borderRadius: 12, cursor: 'pointer',
          border: '1px solid var(--line)', background: 'transparent',
          color: 'var(--dim)', fontSize: 14,
        }}>
          Uygulamayı yeniden başlat
        </button>

        <p style={{
          color: '#5b6376', fontSize: 11.5, marginTop: 22, lineHeight: 1.6,
        }}>
          <b>Tarayıcı verilerini silme.</b> Kayıtların orada duruyor;
          silersen geri gelmez.
        </p>

        <details style={{ marginTop: 14 }}>
          <summary style={{ color: '#5b6376', fontSize: 11.5, cursor: 'pointer' }}>
            teknik ayrıntı
          </summary>
          <pre style={{
            fontSize: 10, color: '#8b93a5', whiteSpace: 'pre-wrap',
            marginTop: 6, lineHeight: 1.5,
          }}>{String(this.state.error?.stack ?? this.state.error)}</pre>
        </details>
      </div>
    );
  }
}
