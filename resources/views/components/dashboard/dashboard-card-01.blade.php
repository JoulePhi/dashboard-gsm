<div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <div class="px-2 pt-2">
        <header class="flex flex-row items-start mb-2">
            <!-- Icon -->
            <img src="{{ asset('images/ph-meter.png') }}" width="32" height="32" alt="Icon 01" class="fill-white" />

            <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 ml-2">PH</h2>
        </header>
    </div>
    <!-- Chart built with Chart.js 3 -->
    <!-- Check out src/js/components/dashboard-card-01.js for config -->
    <div class="grow">
        <!-- Change the height attribute to adjust the chart height -->
        <canvas id="dashboard-card-01" width="389" height="128"></canvas>
    </div>
</div>
