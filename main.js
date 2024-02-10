// ------------------------ ПОЯСНЕНИЯ К КОДУ ------------------------
// Попробовал сделать простой стейт-менеджер по аналогии с REDUX.
// Отрисовка происходит после изменения стейта. Конкретно для
// "чистого" JS при большом количестве изменений стейта за единицу 
// времени сильно падает производительность, поэтому для каждого
// свойства нужно проверять изменилось ли оно или нет, в коде я 
// этого не реализовывал из-за ненадобности, тк приложение маленькое
// 
// Сэмулировал фейковые запросы к api, ответ от api AmoCRM поместил
// в файл leads.json. Обычные запросы не уходят из-за ошибки CORS'ов
// Пробовал отправлять с разных доменов - результата нет. Поэтому
// делать такой костыль.
// 
// В целом можно было не заморачиваться и сделать все довольно
// примитивно, но в этот раз мне захотелось позаниматься
// "творчеством" :)
// ------------------------------------------------------------------

(async () => {
  // ---------- КЛЮЧИ ----------
  const access_token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmM2Q2NWI2ZDUyOGExNTJlN2QzNjE1N2NiN2RlODk4NTBjYzQ5MjMwZWI0MThhZDc5M2M1ZjA0ZGNkYjY4ODUwMjRkMGIwZGFmZWM2Y2Q5In0.eyJhdWQiOiJjMTg3MGE3OS1kYWZlLTRhOTEtODVlZi04OGU3N2U4M2NiNTYiLCJqdGkiOiJiZjNkNjViNmQ1MjhhMTUyZTdkMzYxNTdjYjdkZTg5ODUwY2M0OTIzMGViNDE4YWQ3OTNjNWYwNGRjZGI2ODg1MDI0ZDBiMGRhZmVjNmNkOSIsImlhdCI6MTcwNzU2OTkzMywibmJmIjoxNzA3NTY5OTMzLCJleHAiOjE3MDc2NTYzMzMsInN1YiI6IjEwNjUzOTAyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTU4ODQyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMmM2NWVmNzctNmE4ZS00OWZmLWFkYjYtNTUwZGYwZDNlNTdlIn0.gVjY6M3xMsRLB0cmo6zpzbtNhrIxJtK_RU2R_4r_yPhhBuff2mzl4MAk7qbrbcY7m0bM3miA9SkIIQmLRRZpluXTTyDJ4ulwc9a7XFf3aBXhoE0DndDvJscCRPwExcI4Qp7PlGz0gYpb8pmiWZwrTu1g7nLQaUJCU6WjUx3-BYZAGBxBoTHB_jLHvjL9nAIdMfcwpxE7LingbZhgYSDJwZbm3LLEA614HG07kasuhUZddjKX4WCkjG5Wk4YJ8V_3g7WEOZEykko3bSbXCXpf2njOD5QJN_vbZky60erbb6f3acwudrvcToLqPa6p9872vY_bob235XdPOKdPtsD7tQ";

  const refresh_token =
    "def50200aa7a5b2cf0b75649944d10c9ed24ca1a55ef5a69f0deb80dc2453ba323804ee35fc2f4e7bd0210cd2a1759d466d20570d3a8d862e584506d2c35a05ee39f32641b471d8dc97d41cbc78710897e32cf05be319a521c940d4abb81f47929804225ad3ca8f705419daed67400774acd901001aa16b41abde46ee70a3e2d04a57e4fd658a0bbb137782e869922e870569893d9657260a4d9139a1bdad4325c93aa5e235a7fd6074815f972e17bd2da85845fb793e6cdafcffad9c7bb73814e7d512009cb44b2524b860afd32d4f64e5b371202dfcb5989e95b3c862928c3169d665e93c0f2a293d6db1b6784cf804176eb6f8db26d4d8c186c84b1797965a9dc4bf29315f7cf1ab716eec5c61963775be52f54d0b41a8d1e860cb8f9a95508df2af83b138a2f3faa48a04939aa4014e49e79425a31d125c32a762effd2d1ff5f1f2e66b9633aca116ff86105b912077bd7e3fb94fda49ebdae052ecd98ed8ca568f2949c67d0f70037266f906d28934649b8b4b5b060650ea8a3d2ab12ba4862a4da7a0d7c991d5213da98caed609ffeb653d1beca74067df6b7b3e20fa746bc2c76c7921d97680d8b17bdf73d379cd77662bc24cf34c4e35610b09f07fb53442267606aefd3c35325110bd7ba07186d3a3dad34c55a2fe5f363fc3b520f359127e464e6c6fcfbece63633d7";

  // ---------- ЭМУЛИРОВАНИЕ ЗАПРОСА К АПИ ----------
  const leadsResponse = await fetch("./leads.json");
  const leadsResponseResult = await leadsResponse.json();

  const fakeApi = {
    getLeads: async (page, limit, sortBy = "nameUp") => {
      return new Promise((resolve, reject) => {
        if (true) {
          let sortedLeads = [...leadsResponseResult._embedded.leads];

          switch (sortBy) {
            case "nameUp":
              sortedLeads = sortedLeads.sort((a, b) =>
                a.name > b.name ? 1 : -1
              );
              break;
            case "nameDown":
              sortedLeads = sortedLeads.sort((a, b) =>
                a.name > b.name ? -1 : 1
              );
              break;
            case "budgetUp":
              sortedLeads = sortedLeads.sort((a, b) => a.price - b.price);
              break;
            case "budgetDown":
              sortedLeads = sortedLeads.sort((a, b) => b.price - a.price);

              break;
          }

          resolve(
            sortedLeads.splice(
              (page - 1) * limit,
              limit == -1 ? leadsResponseResult._embedded.leads : limit
            )
          );
        } else {
          reject("Ошибка");
        }
      });
    },
  };

  // ---------- СТЕЙТ МЕНЕДЖЕР ----------
  const createStore = (reducer, initialState) => {
    let state = initialState;

    return {
      subscribers: [],
      dispatch(action) {
        state = reducer(state, action);

        this.subscribers.forEach((fn) => fn(this.getState()));
      },
      getState() {
        return state;
      },
      subscribe(fn) {
        this.subscribers = [...this.subscribers, fn];
        fn(this.getState());

        return () => {
          this.subscribers = this.subscribers.filter((sub) => sub !== fn);
        };
      },
    };
  };

  const counterReducer = (state, action) => {
    switch (action.type) {
      case "SET_LEADS":
        return {
          ...state,
          leads: action.payload,
        };
      case "ADD_LEADS":
        return {
          ...state,
          leads: [...state.leads, ...action.payload],
        };
      case "SET_LIMIT":
        return {
          ...state,
          limit: action.payload,
          maxPages: Math.ceil(
            leadsResponseResult._embedded.leads.length / action.payload
          ),
          currentPage: 1,
          isLoading: false,
        };
      case "SET_CURRENT_PAGE":
        return {
          ...state,
          currentPage: action.payload,
        };
      case "SET_IS_LOADING":
        return {
          ...state,
          isLoading: action.payload,
        };
      case "SET_SORT_BY":
        return {
          ...state,
          sortBy: action.payload,
          currentPage: 1,
        };

      default:
        return state;
    }
  };

  const initialState = {
    leads: [],
    leadsAll: leadsResponseResult._embedded.leads,
    limit: 5,
    currentPage: 1,
    maxPages: Math.ceil(leadsResponseResult._embedded.leads.length / 5),
    isLoading: false,
    sortBy: "nameUp",
  };

  const store = createStore(counterReducer, initialState);

  // ---------- ПОЛУЧЕНЕ DOM-элементов ----------
  const tableElement = document.querySelector(".table__body");
  const limitElement = document.querySelector(".limit");
  const sortElement = document.querySelector(".sort");
  const loadingElement = document.querySelector(".table__loading");

  const paginationBodyElement = document.querySelector(".pagination__body");

  // ---------- ОБРАБОТЧИКИ СОБЫТИЙ ----------
  limitElement.addEventListener("change", async (e) => {
    store.dispatch({
      type: "SET_LIMIT",
      payload: +e.target.value,
    });

    const state = store.getState();

    if (+e.target.value == -1) {
      store.dispatch({
        type: "SET_IS_LOADING",
        payload: true,
      });

      loadingElement.classList.add("active");

      store.dispatch({
        type: "SET_LEADS",
        payload: [],
      });

      let page = 1;

      const interval = setInterval(async () => {
        const leads = await fakeApi.getLeads(page, 5, store.getState().sortBy);

        if (leads.length == 0 || store.getState().isLoading == false) {
          store.dispatch({
            type: "IS_LOADING",
            payload: false,
          });

          clearInterval(interval);

          loadingElement.classList.remove("active");

          return;
        }

        store.dispatch({
          type: "ADD_LEADS",
          payload: leads,
        });

        page += 1;
      }, 2000);

    
      return;
    }

    store.dispatch({
      type: "SET_LEADS",
      payload: await fakeApi.getLeads(
        state.currentPage,
        state.limit,
        state.sortBy
      ),
    });
  });

  sortElement.addEventListener("change", async (e) => {
    store.dispatch({
      type: "SET_SORT_BY",
      payload: e.target.value,
    });

    const state = store.getState();

    store.dispatch({
      type: "SET_LEADS",
      payload: await fakeApi.getLeads(
        state.currentPage,
        state.limit,
        e.target.value
      ),
    });
  });

  paginationBodyElement.addEventListener("click", async (e) => {
    if (e.target.classList.contains("pagination__page")) {
      const value = e.target.textContent;

      store.dispatch({
        type: "SET_CURRENT_PAGE",
        payload: +value,
      });

      const state = store.getState();
      store.dispatch({
        type: "SET_LEADS",
        payload: await fakeApi.getLeads(
          state.currentPage,
          state.limit,
          state.sortBy
        ),
      });
    }
  });

  // ---------- РЕНДЕР НА КАЖДОЕ ИЗМЕНЕНИЯ СТОРА ----------
  const state = store.getState();

  store.dispatch({
    type: "SET_LEADS",
    payload: await fakeApi.getLeads(state.currentPage, state.limit),
  });

  const render = async (state) => {
    // Рендер пагинации
    const paginationPages = [];

    for (let i = 1; i <= state.maxPages; i++) {
      paginationPages.push(i);
    }

    const paginationHTML = paginationPages
      .map(
        (el) =>
          `<div class="pagination__page ${
            el == state.currentPage ? "active" : ""
          }">${el}</div>`
      )
      .join("\n");
    paginationBodyElement.innerHTML = paginationHTML;

    // Рендер контента таблицы
    const tableHeaderHTML = `
      <div class="table__row table__heading">
        <div class="table__column">Название сделки</div>
        <div class="table__column">Бюджет</div>
        <div class="table__column">Дата создания</div>
        <div class="table__column">Дата изменения</div>
        <div class="table__column">ID Ответственного</div>
      </div>
    `;

    const filteredLeads = state.leads;

    const tableContentHTML = filteredLeads
      .map((lead) => {
        const leadRowHTML = `
          <div class="table__row">
            <div class="table__column column">${lead.name}</div>
            <div class="table__column column">${lead.price} ₽</div>
            <div class="table__column column">${formatDate(
              lead.created_at
            )}</div>
            <div class="table__column column">${formatDate(
              lead.updated_at
            )}</div>
            <div class="table__column column">${lead.responsible_user_id}</div>
          </div>
      `;

        return leadRowHTML;
      })
      .join("\n");

    const tableHTML = `
      ${tableHeaderHTML}
      ${tableContentHTML}
    `;

    tableElement.innerHTML = tableHTML;

  };

  store.subscribe(render);

  // ---------- TOOLS ----------
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);

    const options = {
      timezone: "UTC",
    };

    return date.toLocaleString("ru", options);
  }
})();
