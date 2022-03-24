# DS4200 S22 Final Project

This template is the starting point for your final project's webpage. Please read all of the information  below. 

## Link to Project Webpage

[Link to Project GitHub Page]('put link to GitHub Page here')

## Setup

1. Clone this repository to your local machine.
   - In your terminal / command prompt `CD` to the directory where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`
   - You should do all your edits locally after cloning this repository. Commit major versions of your code to your git repository.

1. In order to read data from csv files, you will need to use a python simple server. To do so follow these steps:
   - `CD` to or open a terminal / command prompt window in the folder you cloned above.
   - Start a python simple server from that folder with one of these commands (depending on how you set python up on your machine): `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. 
   - After running the command, wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.
   - Open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000. This is where you will see your code rendered. 

1. Create a GitHub Page for your repo. (Detailed instructions for GitHub pages can be found [here](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Using_Github_pages).)

1. Edit near the top of this `README.md` and replace 'put link to GitHub Page here' with the link to your GitHub Page. 

1. In `index.html` update the GitHub repo URL with the URL of your repository. It is in the paragraph with `id='repo-link'`.

1. Add a clickable hyperlink to your GitHub Classroom-generated repository to the end of the Abstract in your working document.

## Organization

Overview of the files and folders provided in your repo.

### Root Files

* `README.md` is this explanatory file.

* `index.html` contains the main website HTML. 

* `style.css` contains CSS to style the website.

* `LICENCE` is the source code license for the template. You can add your name or leave it as is.

### Folders

Each folder has an explanatory `README.md` file.

* `data` will hold the data file(s) for your visualization tool.

* `files` will contain any files you link on your webpage such as screenshots, diagrams, presentation slide deck, video, and final report.

* `js` will contain all JavaScript files you write.   

* `lib` will contain any JavaScript library you use. It currently includes D3. To ensure long-term survivability, *use the included D3 here rather than linking to [d3js.org](https://d3js.org) or some other CDN.* Likewise, put your other libraries here rather than loading them from elsewhere.

## Software license

1. Review the license for your project in `LICENSE`. The default license we include in the template `LICENCE` file is the open source [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause). You are not required to make your project open source but it is preferred and enables easier adoption of your contributions by others. 
   
1. Add your names to `LICENCE`.
If you make any changes to your license other than including your names that are not approved by the teaching staff, you will need to sign a [Non-exclusive Right to Use and Modify Agreement](https://www.ccs.neu.edu/home/cody/courses/shared/S-L_project_partner_usage_agreement.pdf) so your project partner can actually use what you’ve made.

## Workflow

Instead of all working directly out of the main `gh-pages` branch of your repository, we recommend you try a `branching` model for development. With this model, you will create and checkout `branches` of your repository to work on different features of your final project. After a feature is complete, you will committ changes to the branch you were working on, and then create a pull request to merge your changes back into the main branch of the repository. This will help you avoid accidentally overwriting eachother's code, and will keep your work on different aspects of the project more organized. 

You can [learn more about branching here](https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf).   

As you work with your team, you may have issues merging your changes (conflicts are normal! You just need to manage them). We recommend you pick one member of the team to be the project manager and deal with merging any pull requests.

# Academic integrity

You are welcome to use D3 tutorials or resources as a starting point for your code.
However, **you must cite and reference the resources or sample code you use and explain how you use them**.
***This includes anything from [bl.ocks.org](https://bl.ocks.org/), [Observable](https://observablehq.com/@d3/gallery), or [Stack Overflow](https://stackoverflow.com/)!***
Failure to properly cite and attribute code is a breach of academic integrity.

Additionally, you should under no circumstances copy another group's code. You are welcome to ask fellow classmates and students for help and discuss the assignment, but **your group's submission should be your own work**.
See Canvas for more detail on our academic integrity policy and expectations.

# Submission

1. Ensure you updated (1) the GitHub Pages URL at the top of this `README.md` file, (2) the GitHub repository URL in `index.html`, and (3) added a clickable hyperlink to your GitHub Classroom-generated repository to the end of the Abstract in your working document. 

1. Commit all your local files and push them to the remote repository on GitHub which was generated by GitHub Classroom. **We will grade based on what is visible on the GitHub Page**.

1. Make sure your data is included in the repository on GitHub in the `data` folder.

1. Check on Canvas for the specific requirements of the project milestone you are completing including further submission instructions. 
