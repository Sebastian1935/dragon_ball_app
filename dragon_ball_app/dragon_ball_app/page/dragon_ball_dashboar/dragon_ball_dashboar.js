frappe.pages['dragon-ball-dashboar'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Dragon Ball Dashboard',
		single_column: true
	});

    $('<style>').text(`
        .db-dashboard {
            padding: 20px;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
        }
        .stats-card {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .stats-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f, #4d96ff);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .stats-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
            border-color: rgba(255, 255, 255, 0.2);
        }
        .stats-card:hover::before {
            opacity: 1;
        }
        .character-card {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 20px;
            margin: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .character-card:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            border-color: rgba(255, 255, 255, 0.15);
        }
        .character-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.6s;
        }
        .character-card:hover::before {
            left: 100%;
        }
        .character-image {
            width: 80%;
            height: 80%;
			max-height: 220px;
            border-radius: 16px;
            object-fit: cover;
            border: 3px solid transparent;
            background: linear-gradient(45deg, #ff6b6b, #4d96ff);
            background-clip: padding-box;
            margin-bottom: 10px;
            transition: all 0.3s ease;
        }
		#top-characters-container .character-card {
			min-height: 400px;
			max-height: 400px;
		}
		#top-characters-container .character-image {
			object-position: center 10%;
		}			
		#characters-grid > div > div > img {
			object-position: center -10%!important;
		}
        .character-card:hover .character-image {
            border-color: #ffd93d;
            box-shadow: 0 0 20px rgba(255, 217, 61, 0.3);
        }
        .ki-badge {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
            margin: 5px 0;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        .race-badge {
            background: linear-gradient(135deg, #4d96ff 0%, #6bcf7f 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(77, 150, 255, 0.3);
        }
        .search-section {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .filter-btn {
            background: linear-gradient(135deg, #4d96ff 0%, #6bcf7f 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            margin: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(77, 150, 255, 0.3);
        }
        .filter-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(77, 150, 255, 0.4);
            background: linear-gradient(135deg, #6bcf7f 0%, #ffd93d 100%);
        }
        .chart-container {
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            min-height: 400px;
        }
        .chart-container h4 {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .stat-number {
            font-size: 42px;
            font-weight: bold;
            background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 50%, #4d96ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 15px 0;
            text-shadow: 0 0 30px rgba(255, 217, 61, 0.3);
        }
        .stat-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
        }
        .form-control {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            color: white !important;
            border-radius: 25px !important;
            padding: 12px 20px !important;
            transition: all 0.3s ease !important;
        }
        .form-control:focus {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: #4d96ff !important;
            box-shadow: 0 0 0 3px rgba(77, 150, 255, 0.2) !important;
            color: white !important;
        }
        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
        }
        h2 {
            color: white !important;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            font-weight: 300;
        }
        h5, h6 {
            color: white !important;
        }
        .text-center p {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 217, 61, 0.3); }
            50% { box-shadow: 0 0 30px rgba(255, 107, 107, 0.4), 0 0 40px rgba(77, 150, 255, 0.3); }
        }
        .loading-animation {
            animation: pulse 2s infinite, glow 3s infinite;
        }
        
        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #4d96ff, #6bcf7f);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #6bcf7f, #ffd93d);
        }
    `).appendTo('head');

    let dashboard_container = $(`
        <div class="db-dashboard">
            <div class="row">
                <div class="col-md-12">
                    <h2 style="margin-bottom: 30px;">
                        <i class="fa fa-bolt" style="color: #ffd93d;"></i> Dragon Ball Universe Dashboard
                    </h2>
                </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="row" id="stats-container">
			<div class="col-md-3">
			<div class="stats-card loading-animation">
			<div class="stat-label">Total Characters</div>
			<div class="stat-number" id="total-characters">0</div>
			</div>
			</div>
			<div class="col-md-3">
			<div class="stats-card loading-animation">
			<div class="stat-label">Total Races</div>
			<div class="stat-number" id="total-races">0</div>
			</div>
			</div>
			<div class="col-md-3">
			<div class="stats-card loading-animation">
			<div class="stat-label">With Transformations</div>
			<div class="stat-number" id="total-transformations">0</div>
			</div>
			</div>
			<div class="col-md-3">
			<div class="stats-card loading-animation">
			<div class="stat-label">Average Power</div>
			<div class="stat-number" id="avg-power">0</div>
			</div>
			</div>
            </div>
            
            <!-- Top Characters -->
            <div class="row">
			<div class="col-md-12">
			<div class="chart-container">
			<h4><i class="fa fa-trophy" style="color: #ffd93d;"></i> Top 10 Strongest Characters</h4>
			<div class="row" id="top-characters-container"></div>
			</div>
			</div>
            </div>
			
            <!-- Search -->
            <div class="search-section">
                <div class="row">
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="search-input" 
                               placeholder="🔍 Search character..." style="border-radius: 25px;">
                    </div>
                    <div class="col-md-8">
                        <button class="filter-btn" data-race="All">All Races</button>
                        <button class="filter-btn" data-race="Saiyan">Saiyan</button>
                        <button class="filter-btn" data-race="Human">Human</button>
                        <button class="filter-btn" data-race="Namekian">Namekian</button>
                        <button class="filter-btn" data-gender="Male">Male</button>
                        <button class="filter-btn" data-gender="Female">Female</button>
                    </div>
                </div>
            </div>
            
            <!-- Characters Grid -->
            <div class="row">
                <div class="col-md-12">
                    <div class="chart-container">
                        <h4><i class="fa fa-users"></i> All Characters</h4>
                        <div class="row" id="characters-grid"></div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="row">
                <div class="col-md-6">
                    <div class="chart-container">
                        <h4><i class="fa fa-chart-pie"></i> Race Distribution</h4>
                        <div style="position: relative; height: 350px;">
                            <canvas id="race-chart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="chart-container">
                        <h4><i class="fa fa-chart-bar"></i> Gender Distribution</h4>
                        <div style="position: relative; height: 350px;">
                            <canvas id="gender-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).appendTo(page.body);

    let dashboard = {
        init: function() {
            this.allCharacters = null;
            this.loadDashboardData();
            this.attachEventHandlers();
        },

        loadDashboardData: function() {
            frappe.call({
                method: 'dragon_ball_app.dragon_ball_app.doctype.dragon_ball_character.dragon_ball_character.get_dashboard_data',
                callback: function(r) {
                    if (r.message) {
                        dashboard.updateStats(r.message);
                        dashboard.renderTopCharacters(r.message.top_characters);
                        dashboard.renderCharts(r.message);
                        dashboard.loadAllCharacters();
                    } else {
                        // Fallback si no hay método personalizado
                        dashboard.loadBasicData();
                    }
                },
                error: function() {
                    // Fallback en caso de error
                    dashboard.loadBasicData();
                }
            });
        },

        loadBasicData: function() {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Dragon Ball Character',
                    fields: ['name', 'character_name', 'ki', 'race', 'gender', 'image_url'],
                    limit_page_length: 0,
                    order_by: 'ki desc'
                },
                callback: function(r) {
                    if (r.message && r.message.length > 0) {
                        let characters = r.message;
                        dashboard.allCharacters = characters;
                        
                        let stats = dashboard.processStats(characters);
                        dashboard.updateStats(stats);
                        dashboard.renderTopCharacters(characters.slice(0, 10));
                        dashboard.renderChartsFromData(characters);
                        dashboard.renderCharactersGrid(characters);
                    }
                }
            });
        },

        processStats: function(characters) {
            let races = {};
            let genders = {};
            let totalKi = 0;
            
            characters.forEach(char => {
                races[char.race] = (races[char.race] || 0) + 1;
                genders[char.gender] = (genders[char.gender] || 0) + 1;
                totalKi += parseInt(char.ki) || 0;
            });
            
            return {
                total_characters: characters.length,
                races: Object.keys(races).map(race => ({race: race, count: races[race]})),
                gender_distribution: Object.keys(genders).map(gender => ({gender: gender, count: genders[gender]})),
                avg_power: Math.round(totalKi / characters.length)
            };
        },

        updateStats: function(data) {
            $('#total-characters').text(data.total_characters || 0);
            $('#total-races').text(data.races ? data.races.length : 0);
            $('#total-transformations').text(data.transformation_stats?.characters_with_transformations || 0);
            
            if (data.avg_power) {
                $('#avg-power').text(data.avg_power.toLocaleString());
            } else if (data.top_characters && data.top_characters.length > 0) {
                let avgPower = data.top_characters.reduce((sum, char) => sum + (parseInt(char.ki) || 0), 0) / data.top_characters.length;
                $('#avg-power').text(Math.round(avgPower).toLocaleString());
            }
            
            $('.stats-card').removeClass('loading-animation');
        },

        renderTopCharacters: function(characters) {
            let container = $('#top-characters-container');
            container.empty();
            
            if (!characters || characters.length === 0) {
                container.html('<p style="color: rgba(255,255,255,0.7);">No characters found. Please sync data from API.</p>');
                return;
            }
            
            characters.forEach((char, index) => {
                let medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '⭐';
                let characterCard = $(`
                    <div class="col-md-3 col-sm-6">
                        <div class="character-card" data-name="${char.name}">
                            <div class="text-center">
                                <div style="font-size: 28px; margin-bottom: 10px;">${medal}</div>
                                ${char.image_url ? 
                                    `<img src="${char.image_url}" class="character-image" alt="${char.character_name}">` :
                                    `<div class="character-image" style="background: linear-gradient(135deg, #ff6b6b 0%, #4d96ff 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">${char.character_name.charAt(0)}</div>`
                                }
                                <h5 style="margin: 15px 0; color: white; font-weight: 600;">${char.character_name}</h5>
                                <div class="ki-badge">Ki: ${parseInt(char.ki).toLocaleString()}</div>
                                <div class="race-badge">${char.race}</div>
                            </div>
                        </div>
                    </div>
                `);
                container.append(characterCard);
            });
        },

        loadAllCharacters: function(filters = {}) {
            if (dashboard.allCharacters && dashboard.allCharacters.length > 0) {
                let filteredCharacters = dashboard.allCharacters;
                
                if (filters.search_term) {
                    let searchTerm = filters.search_term.toLowerCase();
                    filteredCharacters = filteredCharacters.filter(char => 
                        char.character_name.toLowerCase().includes(searchTerm)
                    );
                }
                
                if (filters.race_filter && filters.race_filter !== 'All') {
                    filteredCharacters = filteredCharacters.filter(char => 
                        char.race === filters.race_filter
                    );
                }
                
                if (filters.gender_filter) {
                    filteredCharacters = filteredCharacters.filter(char => 
                        char.gender === filters.gender_filter
                    );
                }
                
                dashboard.renderCharactersGrid(filteredCharacters);
            } else {
                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'Dragon Ball Character',
                        fields: ['name', 'character_name', 'ki', 'race', 'gender', 'image_url'],
                        limit_page_length: 0
                    },
                    callback: function(r) {
                        if (r.message) {
                            dashboard.allCharacters = r.message;
                            dashboard.renderCharactersGrid(r.message);
                        }
                    }
                });
            }
        },

        renderCharactersGrid: function(characters) {
            let container = $('#characters-grid');
            container.empty();
            
            if (!characters || characters.length === 0) {
                container.html('<p class="text-center" style="color: rgba(255,255,255,0.7);">No characters found.</p>');
                return;
            }
            
            characters.forEach(char => {
                let characterCard = $(`
                    <div class="col-md-2 col-sm-4 col-xs-6">
                        <div class="character-card" data-name="${char.name}" style="text-align: center;">
                            ${char.image_url ? 
                                `<img src="${char.image_url}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid transparent; background: linear-gradient(45deg, #ff6b6b, #4d96ff); background-clip: padding-box;">` :
                                `<div style="width: 60px; height: 60px; object-position: center -10%; border-radius: 50%; background: linear-gradient(135deg, #ff6b6b 0%, #4d96ff 100%); display: flex; align-items: center; justify-content: center; color: white; margin: 0 auto; font-weight: bold;">${char.character_name.charAt(0)}</div>`
                            }
                            <h6 style="margin: 10px 0; font-size: 12px; color: white; font-weight: 600;">${char.character_name}</h6>
                            <small class="ki-badge" style="font-size: 10px;">Ki: ${parseInt(char.ki).toLocaleString()}</small>
                        </div>
                    </div>
                `);
                container.append(characterCard);
            });
        },

        renderChartsFromData: function(characters) {
            let raceData = {};
            let genderData = {};
            
            characters.forEach(char => {
                raceData[char.race] = (raceData[char.race] || 0) + 1;
                genderData[char.gender] = (genderData[char.gender] || 0) + 1;
            });
            
            let processedData = {
                races: Object.keys(raceData).map(race => ({race: race, count: raceData[race]})),
                gender_distribution: Object.keys(genderData).map(gender => ({gender: gender, count: genderData[gender]}))
            };
            
            this.renderCharts(processedData);
        },

        renderCharts: function(data) {
            // Gráfico de razas con diseño mejorado
            if (data.races && data.races.length > 0) {
                let raceCtx = document.getElementById('race-chart').getContext('2d');
                
                new Chart(raceCtx, {
                    type: 'doughnut',
                    data: {
                        labels: data.races.map(r => r.race),
                        datasets: [{
                            data: data.races.map(r => r.count),
                            backgroundColor: [
                                '#ff6b6b', '#4d96ff', '#6bcf7f', '#ffd93d',
                                '#ff8e53', '#845ec2', '#4e9f3d', '#f368e0'
                            ],
                            borderWidth: 0,
                            hoverBorderWidth: 3,
                            hoverBorderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    color: 'white',
                                    font: {
                                        size: 14,
                                        weight: '600'
                                    },
                                    padding: 20,
                                    usePointStyle: true,
                                    pointStyle: 'circle'
                                }
                            }
                        }
                    }
                });
            }
            
            // Gráfico de género con diseño mejorado
            if (data.gender_distribution && data.gender_distribution.length > 0) {
                let genderCtx = document.getElementById('gender-chart').getContext('2d');

                new Chart(genderCtx, {
                    type: 'bar',
                    data: {
                        labels: data.gender_distribution.map(g => g.gender),
                        datasets: [{
                            label: 'Characters',
                            data: data.gender_distribution.map(g => g.count),
                            backgroundColor: ['#ff6b6b', '#4d96ff', '#6bcf7f'],
                            borderWidth: 0,
                            borderRadius: 12,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: 'rgba(255,255,255,0.8)'
                                },
                                grid: {
                                    color: 'rgba(255,255,255,0.1)'
                                },
                                border: {
                                    display: false
                                }
                            },
                            x: {
                                ticks: {
                                    color: 'rgba(255,255,255,0.8)'
                                },
                                grid: {
                                    display: false
                                },
                                border: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        },

        attachEventHandlers: function() {
            // Search input
            $('#search-input').on('keyup', frappe.utils.debounce(function() {
                dashboard.loadAllCharacters({
                    search_term: $(this).val()
                });
            }, 300));
            
            // Filter buttons
            $('.filter-btn').click(function() {
                let btn = $(this);
                let race = btn.data('race');
                let gender = btn.data('gender');
                
                $('.filter-btn').css('opacity', '0.6');
                btn.css('opacity', '1');
                
                dashboard.loadAllCharacters({
                    race_filter: race || '',
                    gender_filter: gender || ''
                });
            });
            
            // Character card click
            $(document).on('click', '.character-card', function() {
                let characterName = $(this).data('name');
                if (characterName) {
                    frappe.set_route('Form', 'Dragon Ball Character', characterName);
                }
            });
        }
    };

    dashboard.init();
    
    if (typeof Chart === 'undefined') {
        frappe.require('https://cdn.jsdelivr.net/npm/chart.js', function() {
            dashboard.loadDashboardData();
        });
    }
}