const companyModel = require('../models/companyModel');

const getEmployeeSegment = (employees) => {
  if (employees <= 10) return 'Микро-команда (1–10)';
  if (employees <= 30) return 'Малый бизнес (11–30)';
  return 'Растущий бизнес (31+)';
};

const getSalesSegment = (monthlySales) => {
  if (monthlySales < 500000) return 'Низкий оборот (< 500 тыс. ₽/мес)';
  if (monthlySales < 2000000) return 'Средний оборот (500 тыс.–2 млн ₽/мес)';
  return 'Высокий оборот (> 2 млн ₽/мес)';
};

const buildDetailedRecommendations = ({
  number_of_employees,
  monthly_sales,
  payback_months,
  crm_cost_share_percent
}) => {
  const tips = [];

  if (number_of_employees <= 10) {
    tips.push('Начните с базового тарифа и минимального набора интеграций.');
  } else if (number_of_employees <= 30) {
    tips.push('Запланируйте этапное внедрение по отделам: продажи → сервис → аналитика.');
  } else {
    tips.push('Для команды 31+ сотрудников используйте расширенный тариф и регламент ролей доступа.');
  }

  if (monthly_sales < 500000) {
    tips.push('Фокус на быстрой окупаемости: автоматизируйте лиды, воронку и напоминания.');
  } else if (monthly_sales < 2000000) {
    tips.push('Добавьте сквозную аналитику и контроль конверсии по каналам.');
  } else {
    tips.push('Используйте продвинутую автоматизацию, SLA и управление KPI в CRM.');
  }

  if (payback_months !== null && payback_months <= 12) {
    tips.push('Окупаемость до года: можно внедрять без отложенного пилота.');
  } else if (payback_months !== null && payback_months <= 24) {
    tips.push('Сначала проведите пилот на 1 отделе и уточните целевые показатели.');
  } else {
    tips.push('Перед полным запуском пересмотрите тариф, число лицензий и план роста.');
  }

  if (crm_cost_share_percent > 7) {
    tips.push('Доля затрат на CRM высокая: сократите лицензии до реально активных пользователей.');
  } else {
    tips.push('Доля затрат на CRM в допустимом диапазоне для малого бизнеса.');
  }

  return tips;
};

const calculateEconomic = async (req, res, next) => {
  try {
    const {
      company_name,
      number_of_employees,
      monthly_sales,
      expected_growth,
      license_cost_per_user
    } = req.body;

    // TCO (упрощённо): лицензия * сотрудники * 12 месяцев.
    const annual_cost = number_of_employees * license_cost_per_user * 12;
    const annual_revenue = monthly_sales * 12;
    const projected_annual_profit = annual_revenue * (expected_growth / 100);
    const payback_months = projected_annual_profit > 0
      ? (annual_cost / projected_annual_profit) * 12
      : null;
    const crm_cost_share_percent = annual_revenue > 0 ? (annual_cost / annual_revenue) * 100 : 0;

    let recommendation = 'Требуется дополнительный анализ.';
    if (payback_months !== null && payback_months <= 12 && crm_cost_share_percent <= 7) {
      recommendation = 'Рекомендуется внедрение: экономика и нагрузка на бюджет комфортные.';
    } else if (payback_months !== null && payback_months <= 24) {
      recommendation = 'Внедрение возможно после пилота и уточнения KPI.';
    } else if (payback_months !== null) {
      recommendation = 'Внедрение рискованно: окупаемость превышает целевой горизонт.';
    }

    const employee_segment = getEmployeeSegment(number_of_employees);
    const sales_segment = getSalesSegment(monthly_sales);
    const recommendation_details = buildDetailedRecommendations({
      number_of_employees,
      monthly_sales,
      payback_months,
      crm_cost_share_percent
    });

    const companyRecord = await companyModel.create({
      company_name,
      number_of_employees,
      monthly_sales,
      expected_growth
    });

    res.json({
      company: companyRecord,
      annual_cost,
      projected_annual_profit,
      payback_months,
      recommendation,
      recommendation_details,
      company_profile: {
        employee_segment,
        sales_segment,
        crm_cost_share_percent
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateEconomic };
