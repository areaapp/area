package com.example.area_android

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import android.content.Intent
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        var serverUrl: String = "0"
        val app = this.application as AreaApplication

        val navController = findNavController(R.id.nav_host_fragment)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_areas, R.id.navigation_settings, R.id.navigation_services
            )
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)


        val url: String = app.serverUrl + "/services"
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this, "Connection to the server failed", Toast.LENGTH_LONG).show()
                    }
                    is Result.Success -> {
                        Toast.makeText(this, "Connected to the server", Toast.LENGTH_SHORT).show()
//                        this.addServices(result.get().obj())
                    }
                }
            }
    }
}
