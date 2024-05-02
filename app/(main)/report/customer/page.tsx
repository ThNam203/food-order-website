"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  RangeFilter,
  SearchFilterObject,
  TimeFilter,
} from "@/components/filter";
import {
  DefaultPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/report/pdf";
import { showErrorToast } from "@/components/toast";
import { CustomerReport } from "@/models/Report";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import ReportService from "@/services/reportService";

import {
  TimeFilterType,
  getDateRangeFromTimeFilterCondition,
  handleRangeNumFilter,
} from "@/utils/func";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerReportPage() {
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [reportDateRangeCondition, setReportDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [reportDateSingleCondition, setReportDateSingleCondition] = useState(
    FilterDay.Today as FilterTime
  );
  const [reportDateControl, setReportDateControl] = useState<TimeFilterType>(
    TimeFilterType.StaticRange
  );
  const range = getDateRangeFromTimeFilterCondition(
    reportDateControl,
    reportDateSingleCondition,
    reportDateRangeCondition
  );

  const [customerCreatorCondition, setCustomerCreatorCondition] = useState<
    { id: number; name: string }[]
  >([]);

  const [valueRangeConditions, setValueRangeConditions] = useState({
    subTotal: {
      startValue: NaN,
      endValue: NaN,
    },
    discountValue: {
      startValue: NaN,
      endValue: NaN,
    },
    revenue: {
      startValue: NaN,
      endValue: NaN,
    },
    returnRevenue: {
      startValue: NaN,
      endValue: NaN,
    },
    netRevenue: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    const fetchReport = async () => {
      const report = await ReportService.getCustomerReport(
        range.startDate,
        range.endDate
      );

      const reportData = report.data;
      const filteredData = handleRangeNumFilter(
        valueRangeConditions,
        reportData
      );
      setReport(filteredData);
    };

    fetchReport().catch((err) => showErrorToast(err));
  }, [
    reportDateRangeCondition,
    reportDateSingleCondition,
    reportDateControl,
    customerCreatorCondition,
    valueRangeConditions,
  ]);

  const filters = [
    <TimeFilter
      key={1}
      title="Report range"
      timeFilterControl={reportDateControl}
      singleTimeValue={reportDateSingleCondition}
      rangeTimeValue={reportDateRangeCondition}
      onTimeFilterControlChanged={(value) => setReportDateControl(value)}
      onSingleTimeFilterChanged={(value) => setReportDateSingleCondition(value)}
      onRangeTimeFilterChanged={(value) => setReportDateRange(value)}
      className="mb-2"
    />,
    // <SearchFilterObject
    //   key={3}
    //   placeholder="Find creator..."
    //   title="Creator"
    //   values={customerCreatorCondition.map((group) => ({
    //     id: group.id,
    //     name: group.name,
    //     displayString: group.name,
    //   }))}
    //   choices={staffs.map((group) => ({
    //     id: group.id,
    //     name: group.name,
    //     displayString: group.name,
    //   }))}
    //   filter={(value: any, queryString: string) =>
    //     value.id.toString().includes(queryString) ||
    //     value.name.includes(queryString)
    //   }
    //   onValuesChanged={(values) =>
    //     setCustomerCreatorCondition([
    //       ...values.map((v: any) => {
    //         return { id: v.id, name: v.name };
    //       }),
    //     ])
    //   }
    //   className="mb-2"
    // />,
    <RangeFilter
      key={2}
      title="Sub Total"
      range={valueRangeConditions.subTotal}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, subTotal: value }))
      }
    />,
    <RangeFilter
      key={3}
      title="Discount Value"
      range={valueRangeConditions.discountValue}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, discountValue: value }))
      }
    />,
    <RangeFilter
      key={4}
      title="Revenue"
      range={valueRangeConditions.revenue}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, revenue: value }))
      }
    />,
    <RangeFilter
      key={5}
      title="Return Revenue"
      range={valueRangeConditions.returnRevenue}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, returnRevenue: value }))
      }
    />,
    <RangeFilter
      key={6}
      title="Net Revenue"
      range={valueRangeConditions.netRevenue}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, netRevenue: value }))
      }
    />,
  ];

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
      title="CUSTOMER REPORT"
      dataProperties={[
        "customerId",
        "customerName",
        "subTotal",
        "discountValue",
        "revenue",
        "returnRevenue",
        "netRevenue",
      ]}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Customer Report"
      headerButtons={[<ReportPDFDownloadButton key={0} PdfContent={PDF!} />]}
    >
      <div className="flex flex-col space-y-4">
        {report ? (
          <ReportPDFView
            PdfContent={PDF!}
            classname="w-full h-[1000px] bg-black text-primaryWord"
          />
        ) : null}
      </div>
    </PageWithFilters>
  );
}
