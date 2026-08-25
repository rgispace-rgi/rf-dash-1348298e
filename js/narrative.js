/* ============================================================
   Riassunto in parole normali.

   Il testo e' generato dalle metriche in modo deterministico: nessun
   modello linguistico decide i numeri (§35). Qui si sceglie solo COME
   raccontarli — e la scelta piu' utile e' tradurre le percentuali in
   soldi: "падіння 30%" non dice niente, "з 1000 євро залишилось 700"
   lo capisce chiunque.
   ============================================================ */
import { lang } from './i18n.js';

const I = { uk: 0, ru: 1, it: 2 };
const pick = row => row[I[lang()]] ?? row[0];

/* Capitale di riferimento per tradurre le percentuali in denaro. */
export const REF = 1000;

const NBSP = ' ';
const grp = (x, dec = 0) => {
  const neg = x < 0, fx = Math.abs(x).toFixed(dec);
  let [i, f] = fx.split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (neg ? '−' : '') + i + (f ? ',' + f : '');
};
const money = v => grp(v, 0);

/* Ucraino e russo cambiano il sostantivo secondo il numero: 1 рік, 2 роки,
   5 років. Scrivere "6 роки" e' un errore che si nota subito, come
   scrivere "6 anno" in italiano. */
function plural(n, forms) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}
const UNIT = {
  years:  [['рік', 'роки', 'років'],
           ['год', 'года', 'лет'],
           ['anno', 'anni', 'anni']],
  months: [['місяць', 'місяці', 'місяців'],
           ['месяц', 'месяца', 'месяцев'],
           ['mese', 'mesi', 'mesi']],
  days:   [['день', 'дні', 'днів'],
           ['день', 'дня', 'дней'],
           ['giorno', 'giorni', 'giorni']]
};
function qty(n, unit) {
  const forms = UNIT[unit][I[lang()]] ?? UNIT[unit][2];
  return n + ' ' + plural(n, forms);
}
const pc = (v, d = 0) => (v > 0 ? '+' : '') + grp(v, d) + '%';
/* Sopra il migliaio si dice "il capitale si e' moltiplicato per N":
   e' l'unico modo in cui una cifra a cinque zeri diventa comprensibile. */
const times = v => '×' + grp(1 + v / 100, Math.abs(v) >= 10000 ? 0 : 1);
const retTxt = v => Math.abs(v) >= 1000 ? `${times(v)} (${pc(v)})` : pc(v);

/* ---------- come opera ---------- */
function style(t) {
  const d = t.durMin;
  if (d === null || d === undefined) return null;
  if (d < 15) return pick([
    'дуже швидка торгівля: позиція живе менше чверті години',
    'очень быстрая торговля: позиция живёт меньше четверти часа',
    'operazioni molto rapide: una posizione dura meno di un quarto d\'ora']);
  if (d < 480) return pick([
    'торгівля всередині дня: позиції закриваються за кілька годин',
    'торговля внутри дня: позиции закрываются за несколько часов',
    'opera dentro la giornata: chiude le posizioni in poche ore']);
  if (d < 4320) return pick([
    'позиції тримаються кілька днів',
    'позиции удерживаются несколько дней',
    'tiene le posizioni per qualche giorno']);
  return pick([
    'довгі позиції: тижні або місяці',
    'длинные позиции: недели или месяцы',
    'posizioni lunghe: settimane o mesi']);
}

function frequency(t) {
  const w = t.perWeek;
  if (!w) return null;
  if (w > 100) return pick([`дуже багато угод — близько ${Math.round(w)} на тиждень`,
    `очень много сделок — около ${Math.round(w)} в неделю`,
    `moltissime operazioni: circa ${Math.round(w)} a settimana`]);
  if (w > 20) return pick([`${Math.round(w)} угод на тиждень`,
    `${Math.round(w)} сделок в неделю`, `circa ${Math.round(w)} operazioni a settimana`]);
  if (w >= 1) return pick([`небагато угод: ${w.toFixed(1)} на тиждень`,
    `немного сделок: ${w.toFixed(1)} в неделю`, `poche operazioni: ${w.toFixed(1)} a settimana`]);
  return pick(['дуже рідко відкриває позиції', 'очень редко открывает позиции',
    'apre posizioni molto di rado']);
}

/* ---------- il paragrafo principale ---------- */
export function summary(t) {
  const out = [];
  const years = t.age ? (t.age / 365) : 0;
  const ageTxt = t.age >= 730 ? qty(Math.floor(years), 'years')
    : t.age >= 60 ? qty(Math.round(t.age / 30.4), 'months')
    : qty(t.age || 0, 'days');

  /* --- 1. chi e' --- */
  const sym = t.topSym
    ? pick([`переважно на ${t.topSym}`, `в основном на ${t.topSym}`, `soprattutto su ${t.topSym}`])
    : '';
  out.push({
    k: 'who',
    tone: 'n',
    h: pick(['Хто це', 'Кто это', 'Chi è']),
    p: pick([
      `Ця стратегія працює вже ${ageTxt} і за цей час зробила ${t.trades ? money(t.trades) : '—'} угод, ${sym}. ${style(t) ? style(t)[0].toUpperCase() + style(t).slice(1) + '.' : ''} ${frequency(t) ? frequency(t)[0].toUpperCase() + frequency(t).slice(1) + '.' : ''}`,
      `Эта стратегия работает уже ${ageTxt} и за это время совершила ${t.trades ? money(t.trades) : '—'} сделок, ${sym}. ${style(t) ? style(t)[0].toUpperCase() + style(t).slice(1) + '.' : ''} ${frequency(t) ? frequency(t)[0].toUpperCase() + frequency(t).slice(1) + '.' : ''}`,
      `Questa strategia è attiva da ${ageTxt} e in questo tempo ha fatto ${t.trades ? money(t.trades) : '—'} operazioni, ${sym}. ${style(t) ? style(t)[0].toUpperCase() + style(t).slice(1) + '.' : ''} ${frequency(t) ? frequency(t)[0].toUpperCase() + frequency(t).slice(1) + '.' : ''}`
    ]).replace(/\s+/g, ' ').trim()
  });

  /* --- 2. quanto ha reso, e quanto ne resta a te --- */
  if (t.ret !== null && t.ret !== undefined) {
    const gross = REF * (1 + t.ret / 100);
    const net = t.net !== null ? REF * (1 + t.net / 100) : null;
    const commTxt = t.comm !== null ? `${Math.round(t.comm)}%` : '—';
    out.push({
      k: 'gain',
      tone: t.ret > 0 ? 'p' : 'n',
      h: pick(['Скільки заробив', 'Сколько заработал', 'Quanto ha guadagnato']),
      p: pick([
        `За весь час стратегія дала ${retTxt(t.ret)}. Але трейдер бере собі ${commTxt} прибутку, тому вам залишилось би приблизно ${retTxt(t.net ?? t.ret)}. Простими словами: ${money(REF)} € перетворилися б приблизно на ${net ? money(net) : '—'} € — не на ${money(gross)} €, як показує сама платформа.`,
        `За всё время стратегия дала ${retTxt(t.ret)}. Но трейдер берёт себе ${commTxt} прибыли, поэтому вам осталось бы примерно ${retTxt(t.net ?? t.ret)}. Простыми словами: ${money(REF)} € превратились бы примерно в ${net ? money(net) : '—'} € — а не в ${money(gross)} €, как показывает сама платформа.`,
        `Da quando è attiva la strategia ha reso ${retTxt(t.ret)}. Ma il trader trattiene il ${commTxt} del profitto, quindi a te resterebbe circa ${retTxt(t.net ?? t.ret)}. In parole semplici: ${money(REF)} € sarebbero diventati circa ${net ? money(net) : '—'} € — non ${money(gross)} € come mostra la piattaforma.`
      ])
    });
  }

  /* --- 3. il rischio, tradotto in denaro --- */
  if (t.dd !== null && t.dd !== undefined) {
    const left = REF * (1 + t.dd / 100);
    const deep = Math.abs(t.dd);
    const judge = deep >= 60 ? pick(['Це дуже багато.', 'Это очень много.', 'È moltissimo.'])
      : deep >= 35 ? pick(['Це чимало.', 'Это немало.', 'È parecchio.'])
      : deep >= 15 ? pick(['Це помірно.', 'Это умеренно.', 'È moderato.'])
      : pick(['Це небагато.', 'Это немного.', 'È poco.']);
    out.push({
      k: 'risk',
      tone: deep >= 35 ? 'w' : 'p',
      h: pick(['Чим ви ризикуєте', 'Чем вы рискуете', 'Cosa rischi'],),
      p: pick([
        `У найгірший момент рахунок падав на ${pc(t.dd, 1)} від найвищої точки. Якби ви вклали ${money(REF)} €, у той день ви побачили б близько ${money(left)} €. ${judge} І важливо: такий момент може повторитися.`,
        `В худший момент счёт падал на ${pc(t.dd, 1)} от самой высокой точки. Если бы вы вложили ${money(REF)} €, в тот день вы увидели бы около ${money(left)} €. ${judge} И важно: такой момент может повториться.`,
        `Nel momento peggiore il conto è sceso del ${pc(t.dd, 1)} rispetto al punto più alto. Se avessi messo ${money(REF)} €, quel giorno ne avresti visti circa ${money(left)} €. ${judge} E va detto: un momento così può ripetersi.`
      ])
    });
  }

  /* --- 4. costanza --- */
  if (t.consistency !== null && t.consistency !== undefined) {
    const c = t.consistency;
    const tone = c >= 70 ? 'p' : c >= 50 ? 'n' : 'w';
    out.push({
      k: 'steady',
      tone,
      h: pick(['Наскільки стабільно', 'Насколько стабильно', 'Quanto è costante']),
      p: pick([
        `${Math.round(c)} зі 100 місяців закривалися в плюс. ${c >= 70 ? 'Результат досить рівний.' : c >= 50 ? 'Бувають і погані місяці.' : 'Результат дуже нерівний: збиткових місяців майже стільки ж, скільки прибуткових.'}`,
        `${Math.round(c)} из 100 месяцев закрывались в плюс. ${c >= 70 ? 'Результат довольно ровный.' : c >= 50 ? 'Бывают и плохие месяцы.' : 'Результат очень неровный: убыточных месяцев почти столько же, сколько прибыльных.'}`,
        `${Math.round(c)} mesi su 100 si sono chiusi in guadagno. ${c >= 70 ? "L'andamento è abbastanza regolare." : c >= 50 ? 'Ci sono anche mesi negativi.' : 'L\'andamento è molto irregolare: i mesi in perdita sono quasi quanti quelli in guadagno.'}`
      ])
    });
  }

  return out;
}

/* ---------- avvertimenti: solo quelli reali ---------- */
export function warnings(t) {
  const w = [];
  const add = (tone, row) => w.push({ tone, p: pick(row) });

  if (t.wiped) add('bad', [
    'Цей рахунок у якийсь момент був повністю обнулений, а потім поповнений заново. Дохід після цього реальний, але сам факт обнулення — найважливіше, що тут є.',
    'Этот счёт в какой-то момент был полностью обнулён, а потом пополнен заново. Доход после этого реальный, но сам факт обнуления — самое важное, что здесь есть.',
    'Questo conto a un certo punto è stato completamente azzerato e poi ricapitalizzato. Il rendimento successivo è reale, ma il fatto di essere arrivati a zero è la cosa più importante da sapere.']);

  if (t.noDD) add('bad', [
    'За всю історію в цієї стратегії немає жодного збиткового дня. Це не означає торгівлю без ризику: найімовірніше, збиткові позиції просто не закриваються і тому не потрапляють у графік.',
    'За всю историю у этой стратегии нет ни одного убыточного дня. Это не означает торговлю без риска: скорее всего, убыточные позиции просто не закрываются и поэтому не попадают в график.',
    'In tutta la sua storia questa strategia non ha un solo giorno in perdita. Non significa che operi senza rischio: molto probabilmente le posizioni in perdita non vengono chiuse, quindi non compaiono nel grafico.']);

  if (t.badSharpe) add('warn', [
    'Показник співвідношення ризику й доходу настільки високий, що в реальній торгівлі так не буває. Це ознака того, що графік не показує справжніх коливань.',
    'Показатель соотношения риска и дохода настолько высок, что в реальной торговле так не бывает. Это признак того, что график не показывает настоящих колебаний.',
    'Il rapporto fra rischio e rendimento è talmente alto da non esistere nel trading reale. È il segnale che il grafico non mostra le oscillazioni vere.']);

  if ((t.mart ?? 0) >= 60) add('bad', [
    `Після збиткової угоди обсяг наступної зростає в середньому в ${(t.volAfterLoss ?? 0).toFixed(1)} раза. Так поводиться мартингейл — спроба відіграти втрату більшою ставкою. Іноді довго працює, а потім забирає все відразу.`,
    `После убыточной сделки объём следующей растёт в среднем в ${(t.volAfterLoss ?? 0).toFixed(1)} раза. Так ведёт себя мартингейл — попытка отыграть потерю большей ставкой. Иногда долго работает, а потом забирает всё сразу.`,
    `Dopo un'operazione in perdita il volume della successiva aumenta in media di ${(t.volAfterLoss ?? 0).toFixed(1)} volte. È il comportamento della martingala: recuperare la perdita puntando di più. A volte funziona a lungo, poi si porta via tutto in una volta.`]);
  else if ((t.mart ?? 0) >= 35) add('warn', [
    'Після збитків обсяг угод дещо зростає. Саме по собі це не помилка, але за цим варто стежити.',
    'После убытков объём сделок несколько растёт. Само по себе это не ошибка, но за этим стоит следить.',
    'Dopo le perdite il volume delle operazioni cresce un po\'. Di per sé non è un errore, ma è una cosa da tenere d\'occhio.']);

  if (t.slippage) add('warn', [
    'Угоди дуже короткі. При копіюванні частина результату втрачається на затримці — повторити ці цифри у себе майже неможливо.',
    'Сделки очень короткие. При копировании часть результата теряется на задержке — повторить эти цифры у себя почти невозможно.',
    'Le operazioni sono molto brevi. Copiandole, una parte del risultato si perde nel ritardo di esecuzione: ottenere gli stessi numeri è quasi impossibile.']);

  if ((t.topSymPct ?? 0) > 90) add('warn', [
    `Майже все — ${Math.round(t.topSymPct)}% — на одному інструменті (${t.topSym}). Якщо цей ринок зміниться, стратегії нема куди відступати.`,
    `Почти всё — ${Math.round(t.topSymPct)}% — на одном инструменте (${t.topSym}). Если этот рынок изменится, стратегии некуда отступать.`,
    `Quasi tutto — il ${Math.round(t.topSymPct)}% — su un solo strumento (${t.topSym}). Se quel mercato cambia, la strategia non ha alternative.`]);

  if ((t.age ?? 0) < 180) add('warn', [
    'Стратегія існує менше пів року. Цього замало, щоб відрізнити вміння від везіння.',
    'Стратегия существует меньше полугода. Этого мало, чтобы отличить умение от везения.',
    'La strategia esiste da meno di sei mesi. È troppo poco per distinguere la bravura dalla fortuna.']);

  if (t.check === 'INCOMPLETE_HISTORY') add('mute', [
    'Історія угод, яку віддає платформа, покриває не весь період графіка. Частина цифр порахована на неповних даних.',
    'История сделок, которую отдаёт платформа, покрывает не весь период графика. Часть цифр посчитана на неполных данных.',
    'Lo storico delle operazioni fornito dalla piattaforma non copre tutto il periodo del grafico. Una parte dei numeri è calcolata su dati incompleti.']);

  if (t.check === 'VALIDATED') add('ok', [
    'Ми перерахували дохідність незалежно від платформи, і цифри збіглися. Це не гарантія майбутнього, але означає, що дані не суперечать самі собі.',
    'Мы пересчитали доходность независимо от платформы, и цифры совпали. Это не гарантия будущего, но означает, что данные не противоречат сами себе.',
    'Abbiamo ricalcolato il rendimento in modo indipendente dalla piattaforma e i numeri coincidono. Non è una garanzia sul futuro, ma vuol dire che i dati non si contraddicono.']);

  return w;
}

/* ---------- una riga di verdetto ---------- */
export function verdict(t) {
  if (!t.ok) return {
    tone: 'bad', t: pick([
      'Цифри виглядають добре, але не описують реальність. Не орієнтуйтеся на них.',
      'Цифры выглядят хорошо, но не описывают реальность. Не ориентируйтесь на них.',
      'I numeri sembrano buoni ma non descrivono la realtà. Non farci affidamento.'])
  };
  const s = t.score ?? 0, dd = Math.abs(t.dd ?? 100), age = t.age ?? 0;
  if (s >= 75 && dd <= 25 && age >= 365) return {
    tone: 'ok', t: pick([
      'Довга історія, помірні падіння, стабільний результат. Один із небагатьох, хто витримує всі перевірки.',
      'Длинная история, умеренные падения, стабильный результат. Один из немногих, кто выдерживает все проверки.',
      'Storia lunga, cali contenuti, risultati stabili. Uno dei pochi che supera tutti i controlli.'])
  };
  if (s >= 60 && dd <= 40) return {
    tone: 'ok', t: pick([
      'Пристойний результат, але з відчутними просіданнями. Підходить, якщо ви готові до коливань.',
      'Приличный результат, но с ощутимыми просадками. Подходит, если вы готовы к колебаниям.',
      'Risultato discreto ma con cali sensibili. Va bene se sei disposto a sopportare le oscillazioni.'])
  };
  if (dd >= 60) return {
    tone: 'bad', t: pick([
      'Дохід високий, але падіння такі глибокі, що більшість людей вийшла б із мінусом, не дочекавшись відновлення.',
      'Доход высокий, но падения такие глубокие, что большинство людей вышло бы в минус, не дождавшись восстановления.',
      'Il rendimento è alto ma i cali sono così profondi che la maggior parte delle persone uscirebbe in perdita prima del recupero.'])
  };
  if (age < 180) return {
    tone: 'warn', t: pick([
      'Занадто мало часу, щоб робити висновки. Варто поспостерігати ще кілька місяців.',
      'Слишком мало времени, чтобы делать выводы. Стоит понаблюдать ещё несколько месяцев.',
      'Troppo poco tempo per trarre conclusioni. Vale la pena osservarlo ancora qualche mese.'])
  };
  return {
    tone: 'warn', t: pick([
      'Середній результат. Нічого небезпечного, але й нічого видатного.',
      'Средний результат. Ничего опасного, но и ничего выдающегося.',
      'Risultato nella media. Niente di pericoloso, ma neanche niente di notevole.'])
  };
}

/* ---------- etichetta di rischio a colpo d'occhio ---------- */
export function riskLabel(t) {
  const dd = Math.abs(t.dd ?? 0);
  if (!t.ok || t.wiped) return ['crit', pick(['дуже високий', 'очень высокий', 'molto alto'])];
  if (dd >= 55 || (t.mart ?? 0) >= 60) return ['high', pick(['високий', 'высокий', 'alto'])];
  if (dd >= 30 || t.extremeVol) return ['warn', pick(['середній', 'средний', 'medio'])];
  return ['normal', pick(['низький', 'низкий', 'basso'])];
}

/* ---------- che cosa fa, in tre parole ---------- */
export function whatItDoes(t) {
  const bits = [];
  const d = t.durMin;
  if (d !== null && d !== undefined) {
    bits.push(d < 15 ? pick(['швидкі угоди', 'быстрые сделки', 'operazioni rapide'])
      : d < 480 ? pick(['всередині дня', 'внутри дня', 'dentro la giornata'])
      : d < 4320 ? pick(['кілька днів', 'несколько дней', 'qualche giorno'])
      : pick(['довгі позиції', 'длинные позиции', 'posizioni lunghe']));
  }
  if (t.topSym) bits.push(t.topSym);
  return bits.join(' · ') || '—';
}
