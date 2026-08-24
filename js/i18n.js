/* ============================================================
   Tre lingue: ucraino (predefinita), russo, italiano.
   E due modi di leggere gli stessi dati: "pro" e "semplice".

   La modalita' semplice non nasconde i numeri: cambia il linguaggio
   con cui li racconta. Chi non sa cos'e' uno Sharpe Ratio ha comunque
   diritto a sapere se un trader e' rischioso.
   ============================================================ */

export const LANGS = { uk: 'УКР', ru: 'РУС', it: 'ITA' };
export const MODES = { pro: 'Pro', simple: 'Simple' };

const D = {
  /* ---------------- navigazione e shell ---------------- */
  'nav.overview':  ['Огляд', 'Обзор', 'Panoramica'],
  'nav.traders':   ['Трейдери', 'Трейдеры', 'Trader'],
  'nav.rankings':  ['Рейтинги', 'Рейтинги', 'Classifiche'],
  'nav.risk':      ['Ризики', 'Риски', 'Rischi'],
  'nav.compare':   ['Порівняння', 'Сравнение', 'Confronto'],
  'nav.watchlist': ['Обране', 'Избранное', 'Preferiti'],
  'nav.quality':   ['Якість даних', 'Качество данных', 'Qualità dei dati'],
  'nav.section':   ['Аналіз', 'Анализ', 'Analisi'],
  'search.ph':     ['Пошук трейдера, стратегії…', 'Поиск трейдера, стратегии…', 'Cerca trader, strategia…'],
  'search.none':   ['Нічого не знайдено', 'Ничего не найдено', 'Nessun risultato'],
  'feed.live':     ['АКТУАЛЬНО', 'АКТУАЛЬНО', 'AGGIORNATO'],
  'feed.stale':    ['ЗАСТАРІЛО', 'УСТАРЕЛО', 'NON RECENTE'],
  'feed.off':      ['НЕ ОНОВЛЮЄТЬСЯ', 'НЕ ОБНОВЛЯЕТСЯ', 'NON AGGIORNATO'],
  'feed.updated':  ['оновлено', 'обновлено', 'aggiornato'],

  /* ---------------- intestazioni di pagina ---------------- */
  'page.overview':     ['Огляд', 'Обзор', 'Panoramica'],
  'page.overview.sub': ['Стан системи, найкращі стратегії та сигнали ризику',
                        'Состояние системы, лучшие стратегии и сигналы риска',
                        'Stato del sistema, migliori strategie e segnali di rischio'],
  'page.traders':      ['Трейдери', 'Трейдеры', 'Trader'],
  'page.traders.sub':  ['{n} проаналізованих стратегій', '{n} проанализированных стратегий',
                        '{n} strategie analizzate'],
  'page.rankings':     ['Рейтинги', 'Рейтинги', 'Classifiche'],
  'page.rankings.sub': ['Кілька рейтингів: жоден єдиний критерій не достатній',
                        'Несколько рейтингов: ни один единственный критерий не достаточен',
                        'Classifiche multiple: nessun criterio unico basta'],
  'page.risk':         ['Моніторинг ризиків', 'Мониторинг рисков', 'Monitoraggio rischi'],
  'page.risk.sub':     ['{n} стратегій із щонайменше одним сигналом ризику',
                        '{n} стратегий как минимум с одним сигналом риска',
                        '{n} strategie con almeno un segnale di rischio'],
  'page.watch':        ['Обране', 'Избранное', 'Preferiti'],
  'page.watch.sub':    ['{n} збережених стратегій', '{n} сохранённых стратегий', '{n} strategie seguite'],
  'page.quality':      ['Якість даних', 'Качество данных', 'Qualità dei dati'],
  'page.quality.sub':  ['Наскільки ми впевнені в оцінці — окремо від того, наскільки добрий трейдер',
                        'Насколько мы уверены в оценке — отдельно от того, насколько хорош трейдер',
                        'Quanto siamo sicuri di poter giudicare, separato da quanto è buono il trader'],

  /* ---------------- KPI ---------------- */
  'kpi.bestnet':    ['Найкращий чистий дохід для того, хто копіює',
                     'Лучший чистый доход для копирующего', 'Miglior rendimento netto per chi copia'],
  'kpi.bestrisk':   ['Найкраще співвідношення ризик/дохід', 'Лучшее соотношение риск/доход',
                     'Miglior rapporto rischio/rendimento'],
  'kpi.tracked':    ['Стратегій під наглядом', 'Стратегий под наблюдением', 'Strategie monitorate'],
  'kpi.coverage':   ['Перевірені дані', 'Проверенные данные', 'Dati verificati'],
  'kpi.risky':      ['Підвищений ризик', 'Повышенный риск', 'Rischio elevato'],
  'kpi.flagged':    ['Позначені як неправдоподібні', 'Помеченные как неправдоподобные',
                     'Segnalati come non credibili'],
  'kpi.worstdd':    ['Найглибше падіння', 'Самое глубокое падение', 'Perdita più profonda'],
  'kpi.avgconf':    ['Середня довіра до даних', 'Среднее доверие к данным', 'Fiducia media nei dati'],
  'kpi.gross':      ['брутто', 'брутто', 'lordo'],
  'kpi.commission': ['комісія', 'комиссия', 'commissione'],
  'kpi.inrating':   ['у рейтингу', 'в рейтинге', 'in classifica'],
  'kpi.trades':     ['операцій', 'операций', 'operazioni'],
  'kpi.validated':  ['підтверджено перехресною перевіркою', 'подтверждено перекрёстной проверкой',
                     'confermate da controllo incrociato'],
  'kpi.partial':    ['неповних історій', 'неполных историй', 'storici incompleti'],
  'kpi.flagsub':    ['обнулені, без падінь або нереальний Sharpe',
                     'обнулённые, без падений или нереальный Sharpe',
                     'azzerati, senza cali o Sharpe irreale'],
  'kpi.riskysub':   ['схожі на мартингейл або падіння понад 50%',
                     'похожие на мартингейл или падение свыше 50%',
                     'simili a martingala o perdita oltre il 50%'],

  /* ---------------- colonne tabella (pro) ---------------- */
  'col.trader':  ['Трейдер', 'Трейдер', 'Trader'],
  'col.score':   ['Бал', 'Балл', 'Punteggio'],
  'col.net':     ['Чистий дохід', 'Чистый доход', 'Netto'],
  'col.gross':   ['Брутто', 'Брутто', 'Lordo'],
  'col.dd':      ['Макс. падіння', 'Макс. падение', 'Perdita max'],
  'col.sharpe':  ['Sharpe', 'Sharpe', 'Sharpe'],
  'col.win':     ['Виграшних', 'Выигрышных', 'Vincenti'],
  'col.pf':      ['PF', 'PF', 'PF'],
  'col.hist':    ['Історія', 'История', 'Storia'],
  'col.trades':  ['Операції', 'Операции', 'Operazioni'],
  'col.comm':    ['Комісія', 'Комиссия', 'Commissione'],
  'col.conf':    ['Довіра', 'Доверие', 'Fiducia'],
  'col.trend':   ['Тренд', 'Тренд', 'Andamento'],
  'col.flags':   ['Позначки', 'Метки', 'Segnali'],

  /* ---------------- colonne tabella (semplice) ---------------- */
  'scol.what':    ['Що робить', 'Что делает', 'Cosa fa'],
  'scol.earned':  ['Скільки заробив', 'Сколько заработал', 'Quanto ha guadagnato'],
  'scol.lost':    ['Найгірший момент', 'Худший момент', 'Momento peggiore'],
  'scol.risk':    ['Ризик', 'Риск', 'Rischio'],
  'scol.trust':   ['Наскільки вірити', 'Насколько верить', 'Quanto fidarsi'],
  'scol.years':   ['Досвід', 'Опыт', 'Esperienza'],

  /* ---------------- livelli ---------------- */
  'lvl.low':      ['низький', 'низкий', 'basso'],
  'lvl.medium':   ['середній', 'средний', 'medio'],
  'lvl.high':     ['високий', 'высокий', 'alto'],
  'lvl.veryhigh': ['дуже високий', 'очень высокий', 'molto alto'],
  'trust.high':   ['можна', 'можно', 'sì'],
  'trust.mid':    ['з обережністю', 'с осторожностью', 'con cautela'],
  'trust.low':    ['мало', 'мало', 'poco'],

  /* ---------------- sezioni ---------------- */
  'sec.top':      ['Найкращі стратегії зараз', 'Лучшие стратегии сейчас', 'Migliori strategie adesso'],
  'sec.perf':     ['Загальна динаміка', 'Общая динамика', 'Andamento complessivo'],
  'sec.perfsub':  ['8 найкращих за балом', '8 лучших по баллу', 'le 8 migliori per punteggio'],
  'sec.signals':  ['Сигнали ризику', 'Сигналы риска', 'Segnali di rischio'],
  'sec.scatter':  ['Ризик і дохід', 'Риск и доход', 'Rischio e rendimento'],
  'sec.scattersub': ['кожна точка — стратегія · розмір = довіра до даних',
                     'каждая точка — стратегия · размер = доверие к данным',
                     'ogni punto è una strategia · dimensione = fiducia nei dati'],
  'sec.summary':  ['Що це за трейдер', 'Что это за трейдер', 'Che trader è'],
  'sec.numbers':  ['Цифри', 'Цифры', 'I numeri'],

  /* ---------------- scheda trader ---------------- */
  'tr.registered': ['Відкрито', 'Открыт', 'Aperto il'],
  'tr.history':    ['Історія', 'История', 'Storia'],
  'tr.currency':   ['Валюта', 'Валюта', 'Valuta'],
  'tr.leverage':   ['Плече', 'Плечо', 'Leva'],
  'tr.subs':       ['Підписники', 'Подписчики', 'Iscritti'],
  'tr.minEquity':  ['Мінімум', 'Минимум', 'Minimo'],
  'tr.group':      ['Тип рахунку', 'Тип счёта', 'Tipo conto'],
  'tr.copied':     ['Скопійований капітал', 'Скопированный капитал', 'Capitale copiato'],
  'tr.notfound':   ['Трейдера не знайдено', 'Трейдер не найден', 'Trader non trovato'],
  'tr.back':       ['До списку', 'К списку', "Torna all'elenco"],
  'tr.strategyret':['Дохід стратегії', 'Доход стратегии', 'Rendimento della strategia'],
  'tr.netret':     ['Оцінка чистого доходу', 'Оценка чистого дохода', 'Stima del rendimento netto'],
  'tr.maxdd':      ['Максимальне падіння', 'Максимальное падение', 'Perdita massima'],
  'tr.perf':       ['Динаміка', 'Динамика', 'Andamento'],
  'tr.monthly':    ['Дохід по місяцях', 'Доход по месяцам', 'Rendimento mensile'],
  'tr.economics':  ['Що залишається тому, хто копіює', 'Что остаётся копирующему',
                    'Cosa resta a chi copia'],
  'tr.strategy':   ['Як він торгує', 'Как он торгует', 'Come opera'],
  'tr.dataconf':   ['Наскільки можна вірити цифрам', 'Насколько можно верить цифрам',
                    'Quanto ci si può fidare dei numeri'],
  'tr.recent':     ['Останні операції', 'Последние операции', 'Ultime operazioni'],
  'tr.notavail':   ['Немає в джерелі', 'Нет в источнике', 'Non disponibile'],

  /* ---------------- modalita' semplice: intestazione ---------------- */
  'simple.title':  ['Простий режим', 'Простой режим', 'Modalità semplice'],
  'simple.intro':  ['Ті самі дані, пояснені звичайною мовою. Цифри не змінюються — змінюється спосіб розповіді.',
                    'Те же данные, объяснённые обычным языком. Цифры не меняются — меняется способ рассказа.',
                    'Gli stessi dati, spiegati in parole semplici. I numeri non cambiano: cambia come vengono raccontati.'],
  'simple.what':   ['Що показує ця сторінка', 'Что показывает эта страница', 'Cosa mostra questa pagina'],
  'simple.whatp':  ['Ми зібрали {n} стратегій копітрейдингу RoboForex і перерахували їхні результати самостійно, не покладаючись на цифри платформи. Тут видно, хто заробляє, скільки з цього дійсно дістанеться вам, і чим ви ризикуєте.',
                    'Мы собрали {n} стратегий копитрейдинга RoboForex и пересчитали их результаты самостоятельно, не полагаясь на цифры платформы. Здесь видно, кто зарабатывает, сколько из этого действительно достанется вам, и чем вы рискуете.',
                    'Abbiamo raccolto {n} strategie di copy trading di RoboForex e ricalcolato i loro risultati per conto nostro, senza fidarci dei numeri della piattaforma. Qui si vede chi guadagna, quanto di quel guadagno arriverebbe davvero a te, e cosa rischi.'],
  'simple.readmore': ['Показати всі технічні цифри', 'Показать все технические цифры',
                      'Mostra tutti i numeri tecnici'],

  /* ---------------- segnali di rischio ---------------- */
  'sig.mart':   ['середній обсяг ×{x} після збитку — схоже на мартингейл',
                 'средний объём ×{x} после убытка — похоже на мартингейл',
                 'volume medio ×{x} dopo una perdita — simile alla martingala'],
  'sig.dd':     ['максимальне падіння {x}', 'максимальное падение {x}',
                 'perdita massima {x}'],
  'sig.vol':    ['річна волатильність {x}', 'годовая волатильность {x}',
                 'volatilità annua {x}'],
  'sig.conc':   ['{x}% операцій на одному інструменті ({s})',
                 '{x}% операций на одном инструменте ({s})',
                 '{x}% delle operazioni su un solo strumento ({s})'],
  'sig.partial':['неповна історія: метрики з меншою довірою',
                 'неполная история: метрики с меньшим доверием',
                 'storico parziale: metriche con fiducia ridotta'],
  'sig.wiped':  ['рахунок був обнулений', 'счёт был обнулён', 'il conto è stato azzerato'],
  'sig.none':   ['Сигналів немає', 'Сигналов нет', 'Nessun segnale'],

  /* ---------------- etichette dei flag ---------------- */
  'flag.zero':  ['Крива торкалася −95% або гірше: рахунок було обнулено і поповнено заново',
                 'Кривая касалась −95% или хуже: счёт был обнулён и пополнен заново',
                 'La curva ha toccato −95% o peggio: conto azzerato e ricapitalizzato'],
  'flag.nodd':  ['Жодного негативного дня за всю історію: графік показує лише реалізоване',
                 'Ни одного отрицательного дня за всю историю: график показывает только реализованное',
                 'Nessun giorno negativo in tutta la storia: il grafico mostra solo il realizzato'],
  'flag.sr':    ['Sharpe понад 8: у реальній торгівлі так не буває',
                 'Sharpe выше 8: в реальной торговле так не бывает',
                 'Sharpe oltre 8: nel trading reale non accade'],
  'flag.mart':  ['Патерни, сумісні з мартингейлом', 'Паттерны, совместимые с мартингейлом',
                 'Pattern compatibili con la martingala'],
  'flag.vol':   ['Річна волатильність понад 100%', 'Годовая волатильность выше 100%',
                 'Volatilità annua oltre il 100%'],
  'flag.hft':   ['Медіанна тривалість менше 15 хвилин', 'Медианная длительность меньше 15 минут',
                 'Durata mediana sotto i 15 minuti'],
  'flag.part':  ['Історія не покриває всю криву', 'История не покрывает всю кривую',
                 'Lo storico non copre tutta la curva'],
  'flag.ok':    ['Наш перерахунок збігається з платформою', 'Наш пересчёт совпадает с платформой',
                 'Il nostro ricalcolo coincide con la piattaforma'],

  /* ---------------- vista qualita' dati ---------------- */
  'q.cross':    ['Перехресна перевірка дохідності', 'Перекрёстная проверка доходности',
                 'Controllo incrociato del rendimento'],
  'q.crosssub': ['наш перерахунок проти даних платформи', 'наш пересчёт против данных платформы',
                 'il nostro ricalcolo contro il dato della piattaforma'],
  'q.valid':    ['Збігається', 'Совпадает', 'Coincide'],
  'q.incomplete':['Неповна історія — бракує даних, а не аномалія',
                  'Неполная история — не хватает данных, а не аномалия',
                  'Storico incompleto — dato mancante, non anomalia'],
  'q.investigate':['Розбіжність без пояснення', 'Расхождение без объяснения',
                   'Scarto non spiegato'],
  'q.method':   ['Перерахунок використовує ланцюговий time-weighted return по рухах капіталу.',
                 'Пересчёт использует цепной time-weighted return по движениям капитала.',
                 'Il ricalcolo usa il time-weighted return a catena sui movimenti di capitale.'],
  'q.unavail':  ['Недоступно в джерелі', 'Недоступно в источнике', 'Non disponibile dalla fonte'],
  'q.unavailsub':['оголошено, а не змодельовано', 'объявлено, а не смоделировано',
                  'dichiarato, non simulato'],

  /* ---------------- stati vuoti ---------------- */
  'empty.watch':    ['Список порожній', 'Список пуст', 'Elenco vuoto'],
  'empty.watchp':   ['Натисніть зірочку біля імені трейдера, щоб стежити за ним. Вибір зберігається в цьому браузері.',
                     'Нажмите звёздочку рядом с именем трейдера, чтобы следить за ним. Выбор сохраняется в этом браузере.',
                     'Usa la stella accanto al nome di un trader per seguirlo. La scelta resta su questo browser.'],
  'empty.heat':     ['Замало історії для помісячної карти', 'Мало истории для помесячной карты',
                     'Storico insufficiente per la mappa mensile'],
  'empty.trades':   ['Список операцій не експортовано', 'Список операций не экспортирован',
                     'Elenco operazioni non esportato'],
  'err.title':      ['Щось пішло не так', 'Что-то пошло не так', 'Qualcosa non ha funzionato'],

  /* ---------------- scheda trader, modo pro ---------------- */
  'p.ourtwr':    ['наш перерахунок {x}', 'наш пересчёт {x}', 'nostro ricalcolo {x}'],
  'p.aftercomm': ['після комісії {x}%', 'после комиссии {x}%', 'dopo la commissione del {x}%'],
  'p.daily':     ['за денною кривою', 'по дневной кривой', 'su curva giornaliera'],
  'p.annual':    ['річна', 'годовая', 'annualizzata'],
  'p.needs1y':   ['потрібен рік історії', 'нужен год истории', 'serve un anno di storia'],
  'p.extremevol':['екстремальна волатильність', 'экстремальная волатильность', 'volatilità estrema'],
  'p.perweek':   ['{x}/тиждень', '{x}/неделю', '{x}/settimana'],
  'p.slipwarn':  ['чутливий до прослизання', 'чувствителен к проскальзыванию', 'sensibile allo slippage'],
  'p.sharpe':    ['Sharpe', 'Sharpe', 'Sharpe'],
  'p.sortino':   ['Sortino', 'Sortino', 'Sortino'],
  'p.calmar':    ['Calmar', 'Calmar', 'Calmar'],
  'p.vol':       ['Волатильність', 'Волатильность', 'Volatilità'],
  'p.winrate':   ['Виграшних угод', 'Выигрышных сделок', 'Operazioni vincenti'],
  'p.pf':        ['Profit factor', 'Profit factor', 'Profit factor'],
  'p.payoff':    ['Payoff ratio', 'Payoff ratio', 'Payoff ratio'],
  'p.payoffx':   ['середній виграш / середній збиток', 'средний выигрыш / средний убыток',
                  'guadagno medio / perdita media'],
  'p.trades':    ['Операції', 'Операции', 'Operazioni'],
  'p.duration':  ['Медіанна тривалість', 'Медианная длительность', 'Durata mediana'],
  'p.streak':    ['Найдовша серія збитків', 'Самая длинная серия убытков', 'Serie di perdite più lunga'],
  'p.instr':     ['Інструменти', 'Инструменты', 'Strumenti'],
  'p.recovery':  ['Recovery factor', 'Recovery factor', 'Recovery factor'],
  'p.posmonths': ['Прибуткових місяців', 'Прибыльных месяцев', 'Mesi in guadagno'],
  'p.ddbelow':   ['Нижче: падіння від попереднього піку', 'Ниже: падение от предыдущего пика',
                  'Sotto: la perdita dal picco precedente'],
  'p.heatnote':  ['Відсотки з нормалізованої кривої. Порожні клітинки — місяці без даних.',
                  'Проценты из нормализованной кривой. Пустые ячейки — месяцы без данных.',
                  'Percentuali dalla curva normalizzata. Le celle vuote sono mesi senza dati.'],
  'p.grossret':  ['Дохід стратегії', 'Доход стратегии', 'Rendimento della strategia'],
  'p.tradercomm':['Комісія трейдера', 'Комиссия трейдера', 'Commissione del trader'],
  'p.tocopier':  ['тому, хто копіює', 'копирующему', 'a chi copia'],
  'p.totrader':  ['трейдеру', 'трейдеру', 'al trader'],
  'p.estnet':    ['Оцінка чистого доходу', 'Оценка чистого дохода', 'Stima del rendimento netto'],
  'p.obsnet':    ['Виміряний чистий дохід', 'Измеренный чистый доход', 'Rendimento netto misurato'],
  'p.copyeff':   ['Ефективність копіювання', 'Эффективность копирования', 'Efficienza di copia'],
  'p.estnote':   ['Оцінка є <b>верхньою межею</b>: застосовує комісію до брутто, але не враховує high-water mark і витрати на виконання. Виміряне значення потребує рахунку, який реально копіює.',
                  'Оценка является <b>верхней границей</b>: применяет комиссию к брутто, но не учитывает high-water mark и издержки исполнения. Измеренное значение требует счёта, который реально копирует.',
                  'La stima è un <b>limite superiore</b>: applica la commissione al lordo ma non tiene conto di high-water mark né dei costi di esecuzione. Il valore misurato richiede un conto che copi davvero.'],
  'p.slipbox':   ['Медіанна тривалість {x}: на таких швидких стратегіях частина результату губиться в затримці й прослизанні, і з історичних даних її не відновити.',
                  'Медианная длительность {x}: на таких быстрых стратегиях часть результата теряется в задержке и проскальзывании, и из исторических данных её не восстановить.',
                  'Durata mediana {x}: su strategie così rapide una parte del risultato si perde in latenza e slippage, e dai dati storici non è recuperabile.'],
  'p.offerhist': ['Історія умов', 'История условий', 'Storico delle condizioni'],
  'p.offernote': ['Умови змінюються: сьогоднішні не діють для минулого.',
                  'Условия меняются: сегодняшние не действуют для прошлого.',
                  'Le condizioni cambiano: quelle di oggi non valgono per il passato.'],
  'p.martlike':  ['Схожість на мартингейл', 'Похожесть на мартингейл', 'Somiglianza con la martingala'],
  'p.gridlike':  ['Схожість на сітку', 'Похожесть на сетку', 'Somiglianza con la griglia'],
  'p.martnote':  ['Медіанний обсяг після збитку <b>×{a}</b>, після прибутку <b>×{b}</b>. {c} Сигналом є асиметрія між ними, а не саме зростання.',
                  'Медианный объём после убытка <b>×{a}</b>, после прибыли <b>×{b}</b>. {c} Сигналом является асимметрия между ними, а не сам рост.',
                  'Volume mediano dopo una perdita <b>×{a}</b>, dopo un guadagno <b>×{b}</b>. {c} Il segnale è l\'asimmetria fra i due, non la crescita in sé.'],
  'p.escal':     ['Максимум {n} подвоєнь поспіль.', 'Максимум {n} удвоений подряд.',
                  'Massimo {n} raddoppi consecutivi.'],
  'p.gridnote':  ['На основі накладання відкритих позицій на тому самому інструменті.',
                  'На основе наложения открытых позиций на том же инструменте.',
                  'Basato sulla sovrapposizione di posizioni aperte sullo stesso strumento.'],
  'p.bysymbol':  ['Результат за інструментом', 'Результат по инструменту', 'Risultato per strumento'],
  'p.currnote':  ['Суми у валюті рахунку ({x}), без конвертації.',
                  'Суммы в валюте счёта ({x}), без конвертации.',
                  'Importi nella valuta del conto ({x}), non convertiti.'],
  'p.patternbox':['Це <b>виміряні збіги</b> за обсягами й часом, а не впевненість щодо методу трейдера.',
                  'Это <b>измеренные совпадения</b> по объёмам и времени, а не уверенность в методе трейдера.',
                  'Sono <b>compatibilità misurate</b> su volumi e tempi, non certezze sul metodo del trader.'],
  'p.confbox':   ['Це число вимірює, <b>наскільки ми впевнені в оцінці</b>, а не наскільки трейдер добрий. Високий бал із низькою довірою треба читати обережно.',
                  'Это число измеряет, <b>насколько мы уверены в оценке</b>, а не насколько трейдер хорош. Высокий балл с низким доверием надо читать осторожно.',
                  'Questo numero misura <b>quanto siamo sicuri della valutazione</b>, non quanto è bravo il trader. Un punteggio alto con fiducia bassa va letto con cautela.'],
  'p.cf.hist':   ['{x} історії', '{x} истории', '{x} di storia'],
  'p.cf.trades': ['{x} доступних операцій', '{x} доступных операций', '{x} operazioni disponibili'],
  'p.cf.complete':['історія покриває всю криву', 'история покрывает всю кривую',
                   'lo storico copre tutta la curva'],
  'p.cf.partial':['історія неповна', 'история неполная', 'lo storico è parziale'],
  'p.cf.valid':  ['дохідність перерахована і збігається', 'доходность пересчитана и совпадает',
                  'rendimento ricalcolato e coincidente'],
  'p.cf.invalid':['дохідність не звірена', 'доходность не сверена', 'rendimento non riconciliato'],
  'p.cf.comm':   ['комісія прочитана з джерела', 'комиссия прочитана из источника',
                  'commissione letta dalla fonte'],
  'p.cf.commest':['комісія оцінена', 'комиссия оценена', 'commissione stimata'],
  'p.cf.nosltp': ['Stop Loss і Take Profit джерело не надає', 'Stop Loss и Take Profit источник не даёт',
                  'Stop Loss e Take Profit non forniti dalla fonte'],
  'p.cf.trunc':  ['історію обрізано лімітом збирача', 'история обрезана лимитом сборщика',
                  'storico tagliato dal limite del collector'],
  'p.pnldist':   ['Розподіл прибутків і збитків', 'Распределение прибылей и убытков',
                  'Distribuzione di profitti e perdite'],
  'p.durdist':   ['Тривалість', 'Длительность', 'Durata'],
  'p.hourdist':  ['Активність за годинами', 'Активность по часам', 'Attività per ora'],
  'p.recentn':   ['останні {n} · повна історія залишається в базі',
                  'последние {n} · полная история остаётся в базе',
                  'ultime {n} · lo storico completo resta nel database'],
  'p.volnote':   ['Обсяг у сирих одиницях платформи: коефіцієнт переведення в лоти різний для кожного рахунку та інструмента. Прибуток у валюті рахунку.',
                  'Объём в сырых единицах платформы: коэффициент перевода в лоты разный для каждого счёта и инструмента. Прибыль в валюте счёта.',
                  'Volume in unità grezze della piattaforma: il fattore di conversione in lotti varia per conto e strumento. Il profitto è nella valuta del conto.'],
  'th.closed':   ['Закрито', 'Закрыто', 'Chiusa'],
  'th.symbol':   ['Інструмент', 'Инструмент', 'Strumento'],
  'th.side':     ['Напрям', 'Направление', 'Direzione'],
  'th.volume':   ['Обсяг', 'Объём', 'Volume'],
  'th.open':     ['Відкриття', 'Открытие', 'Apertura'],
  'th.close':    ['Закриття', 'Закрытие', 'Chiusura'],
  'th.dur':      ['Тривалість', 'Длительность', 'Durata'],
  'th.comm':     ['Комісія', 'Комиссия', 'Commissione'],
  'th.swap':     ['Своп', 'Своп', 'Swap'],
  'th.pnl':      ['Результат', 'Результат', 'Risultato'],
  'sc.overall':  ['Загальний бал', 'Общий балл', 'Punteggio complessivo'],
  'sc.risk':     ['Ризик', 'Риск', 'Rischio'],
  'sc.cons':     ['Стабільність', 'Стабильность', 'Costanza'],
  'sc.strat':    ['Стратегія', 'Стратегия', 'Strategia'],
  'sc.conf':     ['Довіра до даних', 'Доверие к данным', 'Fiducia nei dati'],

  /* ---------------- avvertenza di legge ---------------- */
  'disc': ['Аналіз минулих результатів. Минула дохідність не гарантує майбутньої. Це не інвестиційна порада. Дані зібрані з RoboForex CopyFX і перераховані незалежно; можливі помилки.',
           'Анализ прошлых результатов. Прошлая доходность не гарантирует будущую. Это не инвестиционная рекомендация. Данные собраны с RoboForex CopyFX и пересчитаны независимо; возможны ошибки.',
           'Analisi di risultati passati. Il rendimento passato non garantisce quello futuro. Non è una raccomandazione di investimento. Dati raccolti da RoboForex CopyFX e ricalcolati in modo indipendente; possono contenere errori.'],
  'disc.preview': ['Приватний перегляд — не поширюйте посилання',
                   'Приватный просмотр — не распространяйте ссылку',
                   'Anteprima privata — non diffondere il link'],
};

/* Il glossario segue la lingua: un tooltip che spiega lo Sharpe in italiano
   dentro un'interfaccia ucraina non spiega niente a nessuno. */
const GLOSS_I18N = {
  sharpe: [['Sharpe Ratio', 'Дохід понад безризиковий, поділений на загальну волатильність. Що вище, то краще дохід окупає коливання. Рахується на денних доходностях.'],
           ['Sharpe Ratio', 'Доход сверх безрискового, делённый на общую волатильность. Чем выше, тем лучше доход окупает колебания. Считается на дневных доходностях.'],
           ['Sharpe Ratio', 'Rendimento in eccesso diviso per la volatilità totale. Più è alto, meglio il rendimento ripaga le oscillazioni. Calcolato su rendimenti giornalieri.']],
  sortino: [['Sortino Ratio', 'Як Sharpe, але враховує лише коливання вниз. Трейдера, що зростає ривками, це не карає.'],
            ['Sortino Ratio', 'Как Sharpe, но учитывает только колебания вниз. Трейдера, растущего рывками, это не наказывает.'],
            ['Sortino Ratio', 'Come lo Sharpe, ma conta solo le oscillazioni verso il basso. Un trader che sale a scatti non viene penalizzato.']],
  calmar: [['Calmar Ratio', 'Річна дохідність, поділена на максимальне падіння. Скільки дає за кожен пункт пережитої просадки.'],
           ['Calmar Ratio', 'Годовая доходность, делённая на максимальное падение. Сколько даёт за каждый пункт пережитой просадки.'],
           ['Calmar Ratio', 'Rendimento annualizzato diviso per la perdita massima. Quanto rende per ogni punto di calo sopportato.']],
  dd: [['Максимальне падіння', 'Найбільша втрата від попереднього піку. Рахується на денній кривій: глибший провал усередині дня не був би видний.'],
       ['Максимальное падение', 'Наибольшая потеря от предыдущего пика. Считается на дневной кривой: более глубокий провал внутри дня не был бы виден.'],
       ['Perdita massima', 'La perdita più grande dal picco precedente. Calcolata su curva giornaliera: un crollo intraday più profondo non sarebbe visibile.']],
  pf: [['Profit Factor', 'Сума виграшів, поділена на суму збитків. Нижче 1 трейдер втрачає. Вище 1,5 зазвичай вважається міцним.'],
       ['Profit Factor', 'Сумма выигрышей, делённая на сумму убытков. Ниже 1 трейдер теряет. Выше 1,5 обычно считается крепким.'],
       ['Profit Factor', 'Somma dei guadagni diviso somma delle perdite. Sotto 1 il trader perde. Sopra 1,5 è considerato solido.']],
  conf: [['Довіра до даних', 'Вимірює не трейдера, а нашу впевненість у даних про нього. Бал 90 при довірі 40 треба читати дуже обережно.'],
         ['Доверие к данным', 'Измеряет не трейдера, а нашу уверенность в данных о нём. Балл 90 при доверии 40 надо читать очень осторожно.'],
         ['Fiducia nei dati', 'Non misura il trader: misura quanto siamo sicuri dei dati su di lui. Un punteggio 90 con fiducia 40 va letto con molta cautela.']],
  net: [['Чистий дохід для того, хто копіює', 'Дохід за вирахуванням комісії трейдера. Це оцінка і верхня межа: не враховує прослизання й high-water mark.'],
        ['Чистый доход для копирующего', 'Доход за вычетом комиссии трейдера. Это оценка и верхняя граница: не учитывает проскальзывание и high-water mark.'],
        ['Rendimento netto per chi copia', 'Il rendimento al netto della commissione del trader. È una stima e un limite superiore: non include slippage né high-water mark.']],
  mart: [['Схожість на мартингейл', 'Наскільки поведінка збігається з подвоєнням після збитків. Це виміряний збіг, а не діагноз.'],
         ['Похожесть на мартингейл', 'Насколько поведение совпадает с удвоением после убытков. Это измеренное совпадение, а не диагноз.'],
         ['Somiglianza con la martingala', 'Quanto il comportamento coincide con il raddoppio dopo le perdite. È una compatibilità misurata, non una diagnosi.']],
  score: [['Загальний бал', 'Складається з результату, ризику, стабільності, історії та стратегії. Інтервал поруч залежить від довіри до даних.'],
          ['Общий балл', 'Складывается из результата, риска, стабильности, истории и стратегии. Интервал рядом зависит от доверия к данным.'],
          ['Punteggio complessivo', 'Composto da risultato, rischio, costanza, storia e strategia. L\'intervallo accanto dipende dalla fiducia nei dati.']],
  hhi: [['Концентрація', 'Індекс Герфіндаля за інструментами. Близько до 1 означає, що трейдер працює практично на одному ринку.'],
        ['Концентрация', 'Индекс Герфиндаля по инструментам. Близко к 1 означает, что трейдер работает практически на одном рынке.'],
        ['Concentrazione', 'Indice di Herfindahl sugli strumenti. Vicino a 1 significa che il trader opera praticamente su un solo mercato.']],
  check: [['Перехресна перевірка', 'Ми перерахували дохідність самостійно і порівняли з платформою. «Збігається» означає, що обидва числа однакові.'],
          ['Перекрёстная проверка', 'Мы пересчитали доходность самостоятельно и сравнили с платформой. «Совпадает» означает, что оба числа одинаковы.'],
          ['Controllo incrociato', 'Abbiamo ricalcolato il rendimento per conto nostro e confrontato con la piattaforma. «Coincide» significa che i due numeri sono uguali.']],
  copyEff: [['Ефективність копіювання', 'Яка частина доходу стратегії справді дістається тому, хто копіює. Сьогодні це оцінка: щоб виміряти, потрібен рахунок, який реально копіює.'],
            ['Эффективность копирования', 'Какая часть дохода стратегии действительно достаётся копирующему. Сегодня это оценка: чтобы измерить, нужен счёт, который реально копирует.'],
            ['Efficienza di copia', 'Quanta parte del rendimento della strategia arriva davvero a chi copia. Oggi è stimata: per misurarla serve un conto che copi davvero.']]
};

export function tip(key, label) {
  const g = GLOSS_I18N[key];
  if (!g) return label || '';
  const r = g[IDX[LANG]] ?? g[2];
  return `<span class="tip">${label || ''}<span class="ti">i</span>
    <span class="tip-body"><b>${r[0]}</b>${r[1]}</span></span>`;
}

let LANG = 'uk';
let MODE = 'simple';
const IDX = { uk: 0, ru: 1, it: 2 };

export function setLang(l) {
  if (!LANGS[l]) return;
  LANG = l;
  document.documentElement.lang = l;
  try { localStorage.setItem('ti_lang', l); } catch (e) { /* privato */ }
}
export function setMode(m) {
  if (!MODES[m]) return;
  MODE = m;
  document.documentElement.dataset.mode = m;
  try { localStorage.setItem('ti_mode', m); } catch (e) { /* privato */ }
}
export const lang = () => LANG;
export const mode = () => MODE;
export const isSimple = () => MODE === 'simple';

export function initPrefs() {
  let l = 'uk', m = 'simple';
  try {
    l = localStorage.getItem('ti_lang') || 'uk';
    m = localStorage.getItem('ti_mode') || 'simple';
  } catch (e) { /* sconosciuto: si resta sui valori predefiniti */ }
  setLang(LANGS[l] ? l : 'uk');
  setMode(MODES[m] ? m : 'pro');
}

/* T('chiave', {n: 12}) — sostituzione dei segnaposto {nome} */
export function T(key, vars) {
  const row = D[key];
  if (!row) return key;
  let s = row[IDX[LANG]] ?? row[0];
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
