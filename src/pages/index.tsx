import React from "react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="text-left grid grid-cols-4 gap-12">
      <div className="space-y-6 col-span-4 lg:col-span-3 order-last lg:order-first">
        <h1 className="text-3xl font-bold">Welcome to TimeWise</h1>
        <blockquote className="text-sm italic text-neutral-500">
          <p>&ldquo;So keep strict watch that how you walk is not as unwise but as wise persons, making the best use of your time.&rdquo; —Eph. 5:15, 16</p>
        </blockquote>
        <p id="important-reminders">As an aid to help you reach your goal as a regular pioneer, TimeWise was created to keep track of your time spent in the ministry. Please take the time to read this guide to utilize all the features this webapp can offer.</p>
        <Separator  />
        <h2 className="text-2xl font-bold">Important Reminders</h2>
        <h3 className="text-xl font-bold">How your data is stored</h3>
        <p>For simplicity and due to time constraints, this webapp is not connected to a database, which means your data is not shared or accessible from anywhere else (not even the developer of this webapp). Where is it stored? It&apos;s stored in your browser&apos;s local storage.</p>
        <h3 className="text-xl font-bold">How to access your data in a different device</h3>
        <p>Due to data is only stored locally in a specific device, you will not be able to view and access your data if you open this webapp in a different device. This means that your data will not sync to your other device.</p>
        <h3 className="text-xl font-bold">How large is the storage capacity</h3>
        <p>This webapp can store up to 5MB of storage. 5MB may seem small, but it actually exceeds the practical use limits. If we assume 1 entry consumes 400 bytes, and you add 4 entries per week, it will take you around 60 years before you could actually maximize the 5MB. To make the best use of your storage, follow the guide for adding time entries.</p>
        <h3 className="text-xl font-bold">How to avoid data loss</h3>
        <p  id="getting-started">To avoid data loss, do not clear your browser&#39;s data. Clearing your browser&#39;s data will delete your existing records in this webapp.</p>
        <Separator />
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <h3 className="text-xl font-bold">Adding time entries</h3>
        <p>To add a time entry, click the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">+ Add Time</code> button located at the top-right of your screen. This button will prompt a drawer to set the date, type of ministry, number of hours, and optionally add the number of Bible studies conducted.</p>
        <div className="p-4 border text-foreground mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-950 rounded-md">
          <p><strong>Important:</strong> It is recommended to only add 1 entry per day. This means that you don&#39;t need to segment your entry based on a type of ministry. For example, imagine in a day you had 2 hours of cart witnessing, 2 hours of conducting Bible studies, and 1 hour of house to house ministry. In total, you had 5 hours of ministry. Add your entry of 5 hours and select all the type of ministry you did for the day.</p>
        </div>
        <p>This method saves storage and more manageable in case you need to update your entry eventually. After finalizing your entry, click <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Save</code> to save your entry or <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Cancel</code> to discard it. That&#39;s it, you&#39;re done!</p>
        <h4 className="text-lg font-bold" >Date (Required)</h4>
        <p>Date is always set to the current day by default. If you need to go to a specific date, a date picker will open to choose a day, month, or year.</p>
        <h4 className="text-lg font-bold" >Type of Ministry (Required: Multiselect)</h4>
        <p>Select all the relevant avenue of ministry you did for the day. You can select multiple types of ministry per entry. Accurately adding the type of ministry in your entry will also help you get insights on your quality of service in the activity overview chart.</p>
        <h4 className="text-lg font-bold" >Hours (Required)</h4>
        <p>Use the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">-</code> and <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">+</code> buttons to decrease and increase the number of hours you want to add in your entry.</p>
        <h4 className="text-lg font-bold" >Bible Studies (Optional)</h4>
        <p>If you conducted a Bible study, use the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">-</code> and <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">+</code> buttons to decrease and increase the number of conducted Bible studies you want to add in your entry.</p>
        <Separator />
        <h3 className="text-xl font-bold">Updating time entries</h3>
        <p>
          To update an existing time entry, locate the entry you want to modify in your daily or monthly entries. Click the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">&#x270E;</code> (pencil) icon next to the entry. This action will open the same drawer used for adding entries, but with your existing data pre-filled. Make your desired changes and click &quot;Save&quot; to update or &quot;Cancel&quot; to keep the original entry.
        </p>
        <h3 className="text-xl font-bold">Deleting time entries</h3>
        <p>
          To delete an existing time entry, locate the entry you want to remove in your daily or monthly entries. Click the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">&#x1F5D1;</code> (trash) icon next to the entry. This action will open a confirmation dialog asking you to confirm the deletion.
        </p>
        <div className="p-4 border text-foreground mt-4 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-950 rounded-md">
          <p>
            <strong>Important:</strong> Deleting an entry is permanent and cannot be undone. Make sure you no longer need the entry before proceeding.
          </p>
        </div>
        <p id="understanding-the-charts">
          To confirm the deletion, click <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Delete</code>. If you change your mind, click <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Cancel</code> to keep the entry.
        </p>
        <Separator />
        <h2 className="text-2xl font-bold">Understanding the Charts</h2>
        <h3 className="text-xl font-bold">Monthly activity overview chart</h3>
        <p>
          This chart shows how often you tagged each type of ministry during the month. It helps you see which activities you focus on the most. Use this to check if you’re balancing your time across different ministry types.
        </p>
        <h3 className="text-xl font-bold">Yearly hour overview</h3>
        <p>
          This chart compares the total hours you recorded over the year, split into two 6-month periods. It helps you see if you’re consistent or improving over time. Use this to set goals and stay on track.
        </p>
        <h3 className="text-xl font-bold">Yearly Bible Study Conducted overview</h3>
        <p id="getting-your-reports">
          This chart is like the yearly hour overview but focuses on the Bible studies you conducted. It also splits the data into two 6-month periods. Use this chart to see how your Bible studies are going and where you can improve.
        </p>
        <Separator />
        <h2 className="text-2xl font-bold" >Getting Your Reports</h2>
        <p>
          TimeWise makes it easy to share your monthly report with your group overseer. Just follow these simple steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Go to the Monthly page where you can view your activity for the month.
          </li>
          <li>
            Click the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Copy Report</code> button. Once clicked, the button text will change to <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Copied!</code> to confirm the report is copied to your clipboard.
          </li>
          <li>
            Open the app or messaging platform where you send your report to your group overseer.
          </li>
          <li>
            Tap and hold the message input field, then select &quot;Paste&quot; when the option appears. Your report will appear in the message field.
          </li>
          <li>
            Send the message to share your report.
          </li>
        </ol>
        <p id="downloading-the-app">
          That’s it! Your monthly report is ready to be shared quickly and easily.
        </p>
        <Separator />
        <h2 className="text-2xl font-bold">Downloading the App</h2>
        <p>
          Though TimeWise is a website, you can actually install it on your phone to use it like an app for quick and easy access. Follow the steps below for your device:
        </p>
        <h3 className="text-xl font-bold">iOS Users</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Open the TimeWise website in Safari on your iPhone or iPad.
          </li>
          <li>
            Tap the <strong>Share</strong> button (a square with an arrow pointing upward) at the bottom of your screen.
          </li>
          <li>
            Scroll down and select <strong>Add to Home Screen</strong>.
          </li>
          <li>
            Rename the app if you’d like, then tap <strong>Add</strong>. The TimeWise icon will now appear on your home screen like an app.
          </li>
        </ol>
        <h3 className="text-xl font-bold">Android Users</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Open the TimeWise website in Chrome on your Android device.
          </li>
          <li>
            Tap the three-dot menu in the top-right corner of your screen.
          </li>
          <li>
            Select <strong>Add to Home Screen</strong>.
          </li>
          <li id="share-timewise-with-others">
            Rename the app if you’d like, then tap <strong>Add</strong>. TimeWise will now appear on your home screen like an app.
          </li>
        </ol>
        <Separator />
        <h2 className="text-2xl font-bold">Share TimeWise with Others</h2>
        <p>
          Do you know someone who could benefit from using TimeWise to keep track of their ministry hours? Sharing this webapp may help them stay organized and reach their goals.
        </p>
        <p>
          Copy the website link from your browser’s address bar and send it through your favorite messaging app, email, or social media platform. Your recommendation could make a big difference for someone looking for an easy way to track their time and service!
        </p>
      </div>
      <div className="text-left col-span-4 lg:col-span-1">
        <div className="static lg:sticky lg:top-[6rem] flex flex-col gap-4">
          <h3 className="text-xl font-bold">Table of Contents</h3>
          <a href="#important-reminders" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Important Reminders</a>
          <a href="#getting-started" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Getting Started</a>
          <a href="#understanding-the-charts" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Understanding the Charts</a>
          <a href="#getting-your-reports" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Getting Your Reports</a>
          <a href="#downloading-the-app" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Downloading the App</a>
          <a href="#share-timewise-with-others" className="text-neutral-500 hover:text-neutral-300 transition-all duration-200 ease-in-out">Share TimeWise with Others</a>
        </div>
      </div>
    </div>
  );
}
