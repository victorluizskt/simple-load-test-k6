import http from "k6/http";

import { sleep } from "k6";
// Rate é um objeto para representar uma métrica personalizada que mantém o controle da porcentagem de valores adicionados que não são zero. É uma das quatro métricas personalizadas.
// Trend é um objeto para representar uma métrica personalizada que permite o cálculo de diferentes estatísticas sobre os valores adicionados (mínimo, máximo, média ou percentis)
import { Trend, Rate, Counter } from "k6/metrics";

import { check, fail } from "k6";

// GetCustomerDuration — variável que representa o tempo em milissegundos para execução do teste
export let GetCustomerDuration = new Trend('get_customer_duration');

// GetCustomerFailRate — variável que representa a métrica de porcentagem de falha da requisição.
export let GetCustomerFailRate = new Trend('get_customer_fail_rate');

// GetCustomerSuccessRate — variável que representa a métrica de porcentagem de sucesso da requisição.
export let GetCustomerSuccessRate = new Trend('get_customer_success_rate');

// GetCustomerReqs — variável que representa a métrica de porcentagem de requisição.
export let GetCustomerReqs = new Trend('get_customer_reqs');

export default function () {
  const params = {
    headers: {
      'login': 'batata',
      'password': 'batata'
    },
  };
  let res = http.get('https://suaUrl.com.br', params);
  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMsg = 'Max Duration ${30000/1000}s';
  // Para concluirmos o nosso cenário de teste de carga, incluímos uma verificação de duração de tempo da requisição do endpoint e com isso colocamos valor máximo que deverá ser executado essa requisição no valor de 4000 ms (convertendo em segundos que equivale a 4 segundos).
  if(!check(res, {
    'max duration': (r) => r.timings.duration < 4000,
  })){
    fail(durationMsg);
  };

  sleep(1);
}